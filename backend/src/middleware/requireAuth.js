// ESM
import jwt from "jsonwebtoken";

/**
 * requireAuth
 * - Reads token from Authorization: Bearer <token> OR x-access-token OR cookie "access_token"
 * - Verifies JWT with process.env.JWT_SECRET (or ACCESS_TOKEN_SECRET)
 * - Normalizes req.user and attaches req.token
 */
export function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || req.headers.Authorization || "";
    let token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : null;

    if (!token && req.headers["x-access-token"]) {
      token = String(req.headers["x-access-token"]);
    }
    if (!token && req.cookies) {
      token = req.cookies["access_token"];
    }

    if (!token) {
      const err = new Error("Unauthorized: missing access token");
      err.status = 401;
      return next(err);
    }

    const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      const err = new Error("Server misconfiguration: JWT secret not set");
      err.status = 500;
      return next(err);
    }

    // Verify token (supports HS/RS; RS needs public key in JWT_SECRET)
    const payload = jwt.verify(token, secret, {
      algorithms: ["HS256", "HS512", "RS256"],
    });

    // Normalize user shape
    const roles =
      (Array.isArray(payload.roles) && payload.roles) ||
      (payload.role ? [payload.role] : []);

    req.user = {
      id: payload.sub || payload.id || payload.userId,
      email: payload.email,
      name: payload.name,
      roles: roles || [],
      tenant: payload.tenant || req.headers["x-tenant-id"],
      // keep the rest in case you need it
      ...payload,
    };
    req.token = token;

    return next();
  } catch (e) {
    // TokenExpiredError, JsonWebTokenError, NotBeforeError -> 401
    e.status = 401;
    return next(e);
  }
}
