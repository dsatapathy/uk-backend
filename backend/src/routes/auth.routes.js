import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();

r.post("/login", AuthController.login);
r.post("/refresh", AuthController.refresh);
r.post("/logout", AuthController.logout);
r.get("/me", authRequired, AuthController.me);
r.post("/logoutAll", AuthController.logoutAll);

export default r;
