import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { unauthorized } from "../utils/resp.js";

export function makeAccessToken(payload) {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: config.ACCESS_TTL });
}
export function verifyAccessToken(token) {
  return jwt.verify(token, config.JWT_ACCESS_SECRET);
}
export function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return unauthorized(res, "Missing Authorization Bearer token");
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // already public shape
    return next();
  } catch {
    return unauthorized(res, "Invalid or expired token");
  }
}
