import { CommentsService } from "../services/comments.service.js";
import { ok, bad } from "../utils/resp.js";

export const CommentsController = {
  list(req, res) {
    const { entityType, entityId, limit, cursor } = req.query;
    if (!entityType || !entityId) return bad(res, "Missing entityType or entityId");
    const page = CommentsService.page(entityType, entityId, { limit: Number(limit) || 20, cursor });
    return ok(res, page.items, { nextCursor: page.nextCursor, total: page.total });
  },

  add(req, res, next) {
    try {
      const { entityType, entityId, body, mentions } = req.body || {};
      const c = CommentsService.add({ entityType, entityId, authorId: req.user.id, body, mentions });
      return ok(res, c);
    } catch (err) { return next(err); }
  },

  edit(req, res, next) {
    try {
      const { body } = req.body || {};
      const c = CommentsService.edit(req.params.id, req.user.id, body);
      return ok(res, c);
    } catch (err) { return next(err); }
  },

  remove(req, res, next) {
    try {
      const r = CommentsService.remove(req.params.id, req.user.id);
      return ok(res, r);
    } catch (err) { return next(err); }
  },
};
