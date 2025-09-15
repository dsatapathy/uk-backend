import { Router } from "express";
import { MenuController } from "../controllers/menu.controller.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();
r.get("/", authRequired, MenuController.get);
export default r;
