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


// ======== BPA MDMS-style option APIs (dummy data) ========

// In-memory catalog (small, fast)
const STATES = [
  { code: "OD", name: "Odisha" },
  { code: "GA", name: "Goa" },
  { code: "UK", name: "Uttarakhand" },
];

const CITIES_BY_STATE = {
  OD: [
    { code: "BBSR", name: "Bhubaneswar" },
    { code: "CTC",  name: "Cuttack" },
  ],
  GA: [
    { code: "PNJ", name: "Panaji" },
    { code: "MRG", name: "Margao" },
  ],
  UK: [
    { code: "DDN", name: "Dehradun" },
    { code: "HRI", name: "Haridwar" },
  ],
};

const WARDS_BY_CITY = {
  BBSR: [
    { code: "W01", name: "Ward 1" },
    { code: "W02", name: "Ward 2" },
    { code: "W03", name: "Ward 3" },
  ],
  CTC: [
    { code: "W04", name: "Ward 4" },
    { code: "W05", name: "Ward 5" },
  ],
  PNJ: [
    { code: "W06", name: "Ward 6" },
    { code: "W07", name: "Ward 7" },
  ],
  MRG: [{ code: "W08", name: "Ward 8" }],
  DDN: [{ code: "W09", name: "Ward 9" }],
  HRI: [{ code: "W10", name: "Ward 10" }],
};

const BUILDING_USE_TYPES = [
  { code: "RES", name: "Residential" },
  { code: "COM", name: "Commercial" },
  { code: "MIX", name: "Mixed Use" },
  { code: "IND", name: "Industrial" },
];
// ======== Menu API (role-aware, 150 items total) ========

// Count all items including nested children
function countItems(list) {
  let n = 0;
  for (const it of list || []) {
    n += 1;
    if (Array.isArray(it.children)) n += countItems(it.children);
  }
  return n;
}

// Build a base menu using your example structure
function baseMenuFor(user) {
  const base = [
    { label: "Home", icon: "home", path: "/" },
    {
      label: "BPA",
      icon: "layers",
      path: "/bpa",
      children: [
        { label: "New Application", path: "/bpa/apply" },
        { label: "My Applications", path: "/bpa/list" },
        {
          label: "Reports",
          icon: "report",
          children: [
            { label: "Daily", path: "/bpa/reports/daily" },
            { label: "Monthly", path: "/bpa/reports/monthly" },
          ],
        },
      ],
    },
    { label: "Trade License", path: "/tl" },
    { label: "Test 1", path: "/tl" },

    { label: "Test 2", path: "/tl" },

    { label: "Test 3", path: "/tl" },


    { label: "Water & Sewerage", path: "/ws" },
    { label: "Docs (external)", icon: "external", url: "https://example.com/docs" },
  ];

  // Optional: add admin-only section
  if (Array.isArray(user?.roles) && user.roles.includes("admin")) {
    base.push({
      label: "Admin",
      icon: "settings",
      children: [
        { label: "User Management", path: "/admin/users" },
        { label: "Role Mapping", path: "/admin/roles" },
        { label: "System Settings", path: "/admin/settings" },
      ],
    });
  }

  // Placeholder parent for many departments; we'll fill it up to reach target count
  base.push({
    label: "Line Departments",
    icon: "layers",
    children: [], // filled dynamically
  });

  return base;
}

// Fill the "Line Departments" node with leaf items until total == target
function padMenuToTarget(menu, targetCount) {
  const totalNow = countItems(menu);
  const needed = Math.max(0, targetCount - totalNow);
  if (!needed) return menu;

  const lineNode = menu.find((m) => m.label === "Line Departments" && Array.isArray(m.children));
  if (!lineNode) return menu; // safety

  const startIndex = lineNode.children.length + 1;
  for (let i = 0; i < needed; i++) {
    const idx = startIndex + i;
    const code = String(idx).padStart(3, "0");
    lineNode.children.push({
      label: `Department ${idx}`,
      // keep icons light; your UI hides them on desktop anyway
      icon: "layers",
      path: `/dept/d${code}`,
    });
  }

  return menu;
}

// Optional tiny cache so we don't rebuild on every call
const menuCache = new Map(); // key: userId|target -> menu

/**
 * GET /api/menu?count=150
 * Header: Authorization: Bearer <accessToken>
 * Returns: { total, menu }
 */
app.get("/api/menu", authMiddleware, (req, res) => {
  const user = req.user; // from JWT (already publicUser-shaped)
  const target = Number.parseInt(req.query.count || "150", 10);
  const TARGET = Number.isFinite(target) && target > 0 ? target : 150;

  const cacheKey = `${user.id}|${TARGET}`;
  if (menuCache.has(cacheKey)) {
    return res.json({ total: countItems(menuCache.get(cacheKey)), menu: menuCache.get(cacheKey) });
  }

  const base = baseMenuFor(user);
  const menu = padMenuToTarget(base, TARGET);

  menuCache.set(cacheKey, menu);
  return res.json({ total: countItems(menu), menu });
});

function filterByQuery(list, q) {
  if (!q) return list;
  const needle = String(q).toLowerCase();
  return list.filter(
    (x) => x.code.toLowerCase().includes(needle) || x.name.toLowerCase().includes(needle)
  );
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


/**
 * GET /api/options/states
 * Optional: ?q=od
 */
app.get("/api/options/states", (req, res) => {
  return res.json(filterByQuery(STATES, req.query.q));
});

/**
 * GET /api/options/cities?state=OD
 * Optional: ?q=bhub
 */
app.get("/api/options/cities", (req, res) => {
  const state = String(req.query.state || "").trim().toUpperCase();
  if (!state) return res.status(400).json({ error: "Missing query param: state" });
  const list = CITIES_BY_STATE[state] || [];
  return res.json(filterByQuery(list, req.query.q));
});

/**
 * GET /api/options/wards?city=BBSR
 * Optional: ?q=1
 */
app.get("/api/options/wards", (req, res) => {
  const city = String(req.query.city || "").trim().toUpperCase();
  if (!city) return res.status(400).json({ error: "Missing query param: city" });
  const list = WARDS_BY_CITY[city] || [];
  return res.json(filterByQuery(list, req.query.q));
});

/**
 * GET /api/options/buildingUseTypes
 * Optional: ?q=res
 */
app.get("/api/options/buildingUseTypes", (req, res) => {
  return res.json(filterByQuery(BUILDING_USE_TYPES, req.query.q));
});

// Health check
app.get("/health", (_req, res) => res.send("OK"));

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
  console.log(`Demo users -> admin/admin123, employee/welcome123`);
});
