import { CommentsRepo } from "../repositories/comments.memory.js";

export const CommentsService = {
  page(entityType, entityId, { limit = 20, cursor } = {}) {
    return CommentsRepo.page(entityType, entityId, { limit, cursor });
  },
  add({ entityType, entityId, authorId, body, mentions = [] }) {
    if (!body) throw Object.assign(new Error("Body required"), { status: 400 });
    return CommentsRepo.add({ entityType, entityId, authorId, body, mentions });
  },
  edit(commentId, authorId, body) {
    const c = CommentsRepo.edit(commentId, { body });
    if (!c) throw Object.assign(new Error("Comment not found"), { status: 404 });
    if (c.authorId !== authorId) throw Object.assign(new Error("Forbidden"), { status: 403 });
    return c;
  },
  remove(commentId, authorId) {
    // simple demo; in real life verify ownership or role
    const ok = CommentsRepo.remove(commentId);
    if (!ok) throw Object.assign(new Error("Comment not found"), { status: 404 });
    return { success: true };
  },
};
