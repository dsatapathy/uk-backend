import { Router } from "express";
import auth from "./auth.routes.js";
import menu from "./menu.routes.js";
import options from "./options.routes.js";
import notifications from "./notifications.routes.js";
import comments from "./comments.routes.js";
import modules from "./modules.routes.js";
const r = Router();

r.use("/auth", auth);
r.use("/menu", menu);
r.use("/options", options);
r.use("/notifications", notifications);
r.use("/comments", comments);
r.use("/modules", modules);

export default r;
