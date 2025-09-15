import { ModulesRepo } from "../repositories/modules.memory.js";

export const ModulesService = {
  list({ tenant, q, page, limit }) {
    return ModulesRepo.list({ tenant, q, page, limit });
  },

  create({ tenant, payload }) {
    // Basic validation
    const required = ["code", "title", "path"];
    for (const k of required) {
      if (!payload?.[k]) {
        const err = new Error(`Missing field: ${k}`);
        err.status = 400;
        throw err;
      }
    }
    return ModulesRepo.create(tenant, payload);
  },

  update({ tenant, id, patch }) {
    const updated = ModulesRepo.update(tenant, id, patch);
    if (!updated) {
      const err = new Error("Module not found");
      err.status = 404;
      throw err;
    }
    return updated;
  },

  remove({ tenant, id }) {
    const removed = ModulesRepo.remove(tenant, id);
    if (!removed) {
      const err = new Error("Module not found");
      err.status = 404;
      throw err;
    }
    return removed;
  },
};
