import { NotificationsService } from "../services/notifications.service.js";
import { ok } from "../utils/resp.js";

export const NotificationsController = {
  list(req, res) {
    const { limit, cursor } = req.query;
    const page = NotificationsService.page(req.user.id, { limit: Number(limit) || 20, cursor });
    return ok(res, page.items, {
      nextCursor: page.nextCursor,
      total: page.total,
      unread: NotificationsService.unreadCount(req.user.id),
    });
  },

  markRead(req, res, next) {
    try {
      const n = NotificationsService.markRead(req.user.id, req.params.id);
      return ok(res, n);
    } catch (err) { return next(err); }
  },

  markAll(req, res) {
    const r = NotificationsService.markAllRead(req.user.id);
    return ok(res, r);
  },
};
