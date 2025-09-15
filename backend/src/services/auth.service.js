import { makeAccessToken } from "../middleware/auth.js";
import { TokensRepo } from "../repositories/tokens.memory.js";
import { UsersRepo, toPublic } from "../repositories/users.memory.js";

export const AuthService = {
  login({ username, password }, ctx) {
    const record = UsersRepo.findByUsername(username);
    if (!record || record.password !== password) throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    const user = toPublic(record);
    const accessToken = makeAccessToken(user);
    const refreshToken = TokensRepo.issue(record.id, ctx);
    const { exp } = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString());
    return { user, accessToken, refreshToken, expiresInSec: exp - Math.floor(Date.now() / 1000) };
  },
  refresh(incoming) {
    if (!incoming) throw Object.assign(new Error("Missing refreshToken"), { status: 400 });
    const rec = TokensRepo.get(incoming);
    if (!rec) throw Object.assign(new Error("Invalid refresh token"), { status: 401 });
    if (Date.now() > rec.expiresAt) { TokensRepo.invalidate(incoming); throw Object.assign(new Error("Refresh token expired"), { status: 401 }); }
    const userRecord = UsersRepo.findById(rec.userId);
    if (!userRecord) { TokensRepo.invalidate(incoming); throw Object.assign(new Error("User not found"), { status: 401 }); }
    const newRefresh = TokensRepo.rotate(incoming, userRecord.id);
    const user = toPublic(userRecord);
    const accessToken = makeAccessToken(user);
    const { exp } = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString());
    return { accessToken, refreshToken: newRefresh, expiresInSec: exp - Math.floor(Date.now() / 100000) };
  },
  logout(incoming) {
    if (incoming) TokensRepo.invalidate(incoming);
    return { success: true };
  },
  logoutAll(username) {
    const u = UsersRepo.findByUsername(username);
    if (!u) throw Object.assign(new Error("User not found"), { status: 404 });
    TokensRepo.invalidateAll(u.id);
    return { success: true };
  },
};
