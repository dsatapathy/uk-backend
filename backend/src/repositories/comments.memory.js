import { uid } from "../utils/ids.js";

/**
 * Comment Thread model
 * threadId = `${entityType}:${entityId}`
 * Comment: { id, threadId, entityType, entityId, authorId, body, mentions: [userId], createdAt, editedAt|null }
 */
const byThread = new Map(); // threadId -> comments newest last (chronological)

function tid(entityType, entityId) { return `${entityType}:${entityId}`; }

export const CommentsRepo = {
  list(entityType, entityId) {
    const t = tid(entityType, entityId);
    if (!byThread.has(t)) byThread.set(t, []);
    return byThread.get(t);
  },
  page(entityType, entityId, { limit = 20, cursor } = {}) {
    const arr = this.list(entityType, entityId);
    const start = Number.isFinite(Number(cursor)) ? Number(cursor) : Math.max(arr.length - limit, 0);
    const slice = arr.slice(start, start + limit);
    const nextCursor = start > 0 ? String(Math.max(start - limit, 0)) : null;
    return { items: slice, nextCursor, total: arr.length };
  },
  add({ entityType, entityId, authorId, body, mentions = [] }) {
    const t = tid(entityType, entityId);
    if (!byThread.has(t)) byThread.set(t, []);
    const c = { id: uid(), threadId: t, entityType, entityId, authorId, body, mentions, createdAt: Date.now(), editedAt: null };
    byThread.get(t).push(c);
    return c;
  },
  edit(commentId, updater) {
    for (const arr of byThread.values()) {
      const idx = arr.findIndex((c) => c.id === commentId);
      if (idx >= 0) {
        arr[idx] = { ...arr[idx], ...updater, editedAt: Date.now() };
        return arr[idx];
      }
    }
    return null;
  },
  remove(commentId) {
    for (const [k, arr] of byThread.entries()) {
      const idx = arr.findIndex((c) => c.id === commentId);
      if (idx >= 0) { arr.splice(idx, 1); return true; }
    }
    return false;
  },
};
