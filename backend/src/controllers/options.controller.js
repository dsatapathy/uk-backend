import {
  listDistricts,
  listBlocks,
  listGps,
  listVillages,
  listClfs,
  listVos,
  listShgs,
  listShgMembers,
  listCatalog,
  listRationTypes
} from "../services/options.service.js";

const ok = (res, payload, maxAgeSeconds = 300) => {
  res.set("Cache-Control", `public, max-age=${maxAgeSeconds}`);
  return res.status(200).json(payload);
};
export const districts = (req, res) => ok(res, listDistricts({ q: req.query.q }));
export const blocks    = (req, res) => {
  const { district, q } = req.query;
  if (!district) return res.status(400).json({ error: "district is required" });
  ok(res, listBlocks({ district, q }));
};
export const gps       = (req, res) => {
  const { block, q } = req.query;
  if (!block) return res.status(400).json({ error: "block is required" });
  ok(res, listGps({ block, q }));
};
export const villages  = (req, res) => {
  const { gp, q } = req.query;
  if (!gp) return res.status(400).json({ error: "gp is required" });
  ok(res, listVillages({ gp, q }));
};

export const clfs      = (req, res) => {
  const { block, q } = req.query;
  if (!block) return res.status(400).json({ error: "block is required" });
  ok(res, listClfs({ block, q }));
};
export const vos       = (req, res) => {
  const { clf, q } = req.query;
  if (!clf) return res.status(400).json({ error: "clf is required" });
  ok(res, listVos({ clf, q }));
};
export const shgs      = (req, res) => {
  const { vo, q } = req.query;
  if (!vo) return res.status(400).json({ error: "vo is required" });
  ok(res, listShgs({ vo, q }));
};
export const shgMembers = (req, res) => {
  const { shg, q } = req.query;
  if (!shg) return res.status(400).json({ error: "shg is required" });
  ok(res, listShgMembers({ shg, q }));
};

export const rationTypes = (req, res) => {
  // const { shg, q } = req.query;
  // if (!shg) return res.status(400).json({ error: "rationType is required" });
  ok(res, listRationTypes({  q: req.query.q }));
};

// catalogs: educationLevels, socialCategories, yesno, etc.
export const catalog = (req, res) => {
  const { key } = req.params;
  ok(res, listCatalog(key, { q: req.query.q }));
};
