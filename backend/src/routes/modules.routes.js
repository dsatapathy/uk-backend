import { Router } from "express";
import { ModulesController } from "../controllers/modules.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

// Public (or auth) list
router.get("/", ModulesController.list);

// Admin-only mutations
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  ModulesController.create
);

router.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  ModulesController.update
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  ModulesController.remove
);

export default router;
