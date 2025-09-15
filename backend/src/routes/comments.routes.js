import { Router } from "express";
import { CommentsController } from "../controllers/comments.controller.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();
r.get("/", authRequired, CommentsController.list);
r.post("/", authRequired, CommentsController.add);
r.patch("/:id", authRequired, CommentsController.edit);
r.delete("/:id", authRequired, CommentsController.remove);
export default r;
