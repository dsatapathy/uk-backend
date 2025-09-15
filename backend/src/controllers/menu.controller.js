import { MenuService } from "../services/menu.service.js";
import { ok } from "../utils/resp.js";

export const MenuController = {
  get(req, res) {
    const target = Number.parseInt(req.query.count || "150", 10);
    const { total, menu } = MenuService.get(req.user, Number.isFinite(target) && target > 0 ? target : 150);
    return ok(res, menu, { total: menu.length });
  },
};
