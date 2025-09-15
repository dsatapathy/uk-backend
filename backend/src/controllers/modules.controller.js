import { ModulesService } from "../services/modules.service.js";
import { ok } from "../utils/resp.js";

function tenantFrom(req) {
  return req.query.tenant || req.headers["x-tenant-id"] || "uk";
}

export const ModulesController = {
  async list(req, res, next) {
    try {
      const { q, page = 1, limit = 50 } = req.query;
      const r = await ModulesService.list({
        tenant: tenantFrom(req),
        q,
        page: Number(page),
        limit: Number(limit),
      });
      return ok(res, r);
    } catch (err) {
      return next(err);
    }
  },

  async create(req, res, next) {
    try {
      const r = await ModulesService.create({
        tenant: tenantFrom(req),
        payload: req.body,
      });
      return ok(res, r, 201);
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const r = await ModulesService.update({
        tenant: tenantFrom(req),
        id: req.params.id,
        patch: req.body,
      });
      return ok(res, r);
    } catch (err) {
      return next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const r = await ModulesService.remove({
        tenant: tenantFrom(req),
        id: req.params.id,
      });
      return ok(res, r);
    } catch (err) {
      return next(err);
    }
  },
};
