// server.js
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import cors from "cors";
import 'dotenv/config';

/**
 * Minimal JWT Auth (no DB) — for demo/local dev
 * Access tokens are short-lived JWTs.
 * Refresh tokens are opaque random strings stored in memory and rotated.
 */

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true, // allow cookies for same-site/local dev
  })
);

// ======== Config (env-friendly with sensible defaults) ========
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev_access_secret_change_me";
const ACCESS_TTL = process.env.ACCESS_TTL || "10m"; // e.g. "10m", "1h"
const REFRESH_TTL_MS =
  process.env.REFRESH_TTL_MS ? parseInt(process.env.REFRESH_TTL_MS, 10) : 7 * 24 * 60 * 60 * 1000; // 7 days
const PORT = process.env.PORT || 3000;

// ======== In-memory Stores (reset on server restart) ========
// Pretend "users table"
const users = new Map([
  // username -> user record
  [
    "admin",
    {
      id: "u_1",
      username: "admin",
      // ⚠️ Plaintext only for demo. In real life, store a hash.
      password: "admin123",
      name: "Admin User",
      roles: ["admin"],
      email: "admin@example.com",
    },
  ],
  [
    "employee",
    {
      id: "u_2",
      username: "employee",
      password: "welcome123",
      name: "Employee One",
      roles: ["employee"],
      email: "employee@example.com",
    },
  ],
]);

// refreshToken -> { userId, expiresAt, userAgent, ip }
// We'll rotate refresh tokens on each /refresh call.
const refreshStore = new Map();

// userId -> Set(refreshToken)
const userRefreshIndex = new Map();

// ======== Helpers ========
function makeAccessToken(payload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}

function issueRefreshToken(user, ctx = {}) {
  const token = crypto.randomBytes(48).toString("base64url"); // opaque, unguessable
  const record = {
    userId: user.id,
    expiresAt: Date.now() + REFRESH_TTL_MS,
    userAgent: ctx.userAgent,
    ip: ctx.ip,
  };
  refreshStore.set(token, record);

  if (!userRefreshIndex.has(user.id)) userRefreshIndex.set(user.id, new Set());
  userRefreshIndex.get(user.id).add(token);

  return token;
}

function rotateRefreshToken(oldToken, user) {
  // Invalidate old
  invalidateRefreshToken(oldToken);
  // Issue new
  return issueRefreshToken(user);
}

function invalidateRefreshToken(token) {
  const rec = refreshStore.get(token);
  if (rec) {
    refreshStore.delete(token);
    const set = userRefreshIndex.get(rec.userId);
    if (set) {
      set.delete(token);
      if (set.size === 0) userRefreshIndex.delete(rec.userId);
    }
  }
}

function invalidateAllUserRefreshTokens(userId) {
  const set = userRefreshIndex.get(userId);
  if (set) {
    for (const t of set) refreshStore.delete(t);
    userRefreshIndex.delete(userId);
  }
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Missing Authorization Bearer token" });

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Shape user data to send in responses
function publicUser(u) {
  return {
    id: u.id,
    username: u.username,
    name: u.name,
    email: u.email,
    roles: u.roles,
  };
}

// ======== Routes ========

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Returns: { user, accessToken, refreshToken, expiresInSec }
 */
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  const record = users.get(String(username || "").trim());

  if (!record || record.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const user = publicUser(record);
  const accessToken = makeAccessToken(user);
  const refreshToken = issueRefreshToken(record, {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });

  // Optional cookie for refresh token (httpOnly). Use only if you prefer cookie flow.
  // res.cookie("refreshToken", refreshToken, {
  //   httpOnly: true,
  //   sameSite: "lax",
  //   maxAge: REFRESH_TTL_MS,
  // });

  return res.json({
    user,
    accessToken,
    refreshToken, // if you’re sending via header/cookie in frontend, you may omit this in body
    expiresInSec: jwt.decode(accessToken).exp - Math.floor(Date.now() / 1000),
  });
});

/**
 * POST /api/auth/refresh
 * Body: { refreshToken }
 * Returns: { accessToken, refreshToken, expiresInSec }
 * - Validates and rotates the refresh token.
 */
app.post("/api/auth/refresh", (req, res) => {
  const incoming = req.body?.refreshToken || req.cookies?.refreshToken;

  if (!incoming) return res.status(400).json({ error: "Missing refreshToken" });

  const record = refreshStore.get(incoming);
  if (!record) return res.status(401).json({ error: "Invalid refresh token" });
  if (Date.now() > record.expiresAt) {
    invalidateRefreshToken(incoming);
    return res.status(401).json({ error: "Refresh token expired" });
  }

  // Load user
  const userEntry = [...users.values()].find((u) => u.id === record.userId);
  if (!userEntry) {
    invalidateRefreshToken(incoming);
    return res.status(401).json({ error: "User not found" });
  }

  // Rotate refresh token (best practice)
  const newRefreshToken = rotateRefreshToken(incoming, userEntry);
  const accessToken = makeAccessToken(publicUser(userEntry));

  // Optional cookie update
  // res.cookie("refreshToken", newRefreshToken, {
  //   httpOnly: true,
  //   sameSite: "lax",
  //   maxAge: REFRESH_TTL_MS,
  // });

  return res.json({
    accessToken,
    refreshToken: newRefreshToken,
    expiresInSec: jwt.decode(accessToken).exp - Math.floor(Date.now() / 1000),
  });
});

/**
 * POST /api/auth/logout
 * Body: { refreshToken }  (or will use cookie if present)
 * - Invalidates the refresh token. (Access tokens just expire naturally.)
 */
app.post("/api/auth/logout", (req, res) => {
  const incoming = req.body?.refreshToken || req.cookies?.refreshToken;
  if (incoming) {
    invalidateRefreshToken(incoming);
    // res.clearCookie("refreshToken");
  }
  return res.json({ success: true });
});

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <accessToken>
 * Returns: { user }
 */
app.get("/api/auth/me", authMiddleware, (req, res) => {
  // req.user is what we encoded in the JWT (publicUser)
  return res.json({ user: req.user });
});

// (Optional) admin helper: logout all sessions for a user
app.post("/api/auth/logoutAll", (req, res) => {
  const { username } = req.body || {};
  const u = username ? users.get(username) : null;
  if (!u) return res.status(404).json({ error: "User not found" });
  invalidateAllUserRefreshTokens(u.id);
  return res.json({ success: true });
});

// Health check
app.get("/health", (_req, res) => res.send("OK"));

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
  console.log(`Demo users -> admin/admin123, employee/welcome123`);
});
