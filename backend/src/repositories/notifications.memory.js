import { uid } from "../utils/ids.js";

/**
 * Notification model
 * { id, userId, title, body, type, createdAt, readAt|null, related: { entityType, entityId } }
 */
const byUser = new Map(); // userId -> array (newest first)

function seedFor(userId) {
  const now = Date.now();
  return [
    { id: uid(), userId, title: "UGVS-REAP : MIS", body: "Velit asperiores et ducimus...", type: "system", createdAt: now - 1000 * 60 * 60 * 4, readAt: null, related: { entityType: "message", entityId: "m1" } },
    { id: uid(), userId, title: "File report ready", body: "Click to view", type: "report", createdAt: now - 1000 * 60 * 60 * 24, readAt: null, related: { entityType: "report", entityId: "r1" } },
  ];
}

export const NotificationsRepo = {
  list(userId) {
    if (!byUser.has(userId)) byUser.set(userId, seedFor(userId));
    return byUser.get(userId);
  },
  page(userId, { limit = 20, cursor } = {}) {
    const all = this.list(userId);
    const start = Number.isFinite(Number(cursor)) ? Number(cursor) : 0;
    const slice = all.slice(start, start + limit);
    const nextCursor = start + slice.length < all.length ? String(start + slice.length) : null;
    return { items: slice, nextCursor, total: all.length };
  },
  markRead(userId, id) {
    const arr = this.list(userId);
    const n = arr.find((x) => x.id === id);
    if (n && !n.readAt) n.readAt = Date.now();
    return n || null;
  },
  markAllRead(userId) {
    const arr = this.list(userId);
    const ts = Date.now();
    arr.forEach((n) => { if (!n.readAt) n.readAt = ts; });
    return arr.length;
  },
  create({ userId, title, body, type = "system", related }) {
    const n = { id: uid(), userId, title, body, type, related: related || null, createdAt: Date.now(), readAt: null };
    const arr = this.list(userId);
    arr.unshift(n);
    return n;
  },
};
