import { AuthService } from "../services/auth.service.js";
import { ok } from "../utils/resp.js";

export const AuthController = {
  login(req, res, next) {
    try {
      const r = AuthService.login(req.body || {}, { userAgent: req.headers["user-agent"], ip: req.ip });
      console.log("User logged in:", r);
      return ok(res, r);
    } catch (err) { return next(err); }
  },

  refresh(req, res, next) {
    try {
      const incoming = req.body?.refreshToken || req.cookies?.refreshToken;
      const r = AuthService.refresh(incoming);
      return ok(res, r);
    } catch (err) { return next(err); }
  },

  logout(req, res, next) {
    try {
      const incoming = req.body?.refreshToken || req.cookies?.refreshToken;
      const r = AuthService.logout(incoming);
      return ok(res, r);
    } catch (err) { return next(err); }
  },

  me(req, res) {
    return ok(res, { user: req.user });
  },

  logoutAll(req, res, next) {
    try {
      const r = AuthService.logoutAll(req.body?.username);
      return ok(res, r);
    } catch (err) { return next(err); }
  },
};
