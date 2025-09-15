import { Router } from "express";
import { NotificationsController } from "../controllers/notifications.controller.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();
r.get("/", authRequired, NotificationsController.list);
r.post("/:id/read", authRequired, NotificationsController.markRead);
r.post("/read-all", authRequired, NotificationsController.markAll);
export default r;
