import { NotificationsRepo } from "../repositories/notifications.memory.js";

export const NotificationsService = {
  page(userId, { limit = 20, cursor } = {}) {
    return NotificationsRepo.page(userId, { limit, cursor });
  },
  unreadCount(userId) {
    return NotificationsRepo.list(userId).filter(n => !n.readAt).length;
  },
  markRead(userId, id) {
    const n = NotificationsRepo.markRead(userId, id);
    if (!n) throw Object.assign(new Error("Notification not found"), { status: 404 });
    return n;
  },
  markAllRead(userId) {
    return { updated: NotificationsRepo.markAllRead(userId) };
  },
};
