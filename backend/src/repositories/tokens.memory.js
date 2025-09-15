import { token } from "../utils/ids.js";
import { config } from "../config/index.js";

/** refreshToken -> { userId, expiresAt, userAgent, ip } */
const refreshStore = new Map();
/** userId -> Set(refreshToken) */
const userRefreshIndex = new Map();

export const TokensRepo = {
  issue(userId, ctx = {}) {
    const t = token(48);
    const rec = { userId, expiresAt: Date.now() + config.REFRESH_TTL_MS, userAgent: ctx.userAgent, ip: ctx.ip };
    refreshStore.set(t, rec);
    if (!userRefreshIndex.has(userId)) userRefreshIndex.set(userId, new Set());
    userRefreshIndex.get(userId).add(t);
    return t;
  },
  get(t) { return refreshStore.get(t) || null; },
  invalidate(t) {
    const rec = refreshStore.get(t);
    if (!rec) return;
    refreshStore.delete(t);
    const set = userRefreshIndex.get(rec.userId);
    if (set) { set.delete(t); if (set.size === 0) userRefreshIndex.delete(rec.userId); }
  },
  invalidateAll(userId) {
    const set = userRefreshIndex.get(userId);
    if (!set) return;
    for (const t of set) refreshStore.delete(t);
    userRefreshIndex.delete(userId);
  },
  rotate(oldToken, userId) {
    this.invalidate(oldToken);
    return this.issue(userId);
  },
};
