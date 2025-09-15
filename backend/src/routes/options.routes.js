import { Router } from "express";
import * as ctrl from "../controllers/options.controller.js";
// import auth from "../middleware/auth.js"; // if you want auth on these

const router = Router();

// router.use(auth); // <- enable if you want Authorization to be required

// Geo
router.get("/districts", ctrl.districts);
router.get("/blocks", ctrl.blocks);
router.get("/gps", ctrl.gps);
router.get("/villages", ctrl.villages);

// CBO ladder
router.get("/clfs", ctrl.clfs);
router.get("/vos", ctrl.vos);
router.get("/shgs", ctrl.shgs);
router.get("/shgMembers", ctrl.shgMembers);
router.get("/rationTypes", (req, res) => ctrl.catalog(req, res, "rationTypes") );
router.get("/yesno", (req, res) => ctrl.catalog(req, res, "yesNo") );
router.get("/educationLevels", (req, res) => ctrl.catalog(req, res, "educationLevels") );
router.get("/socialCategories", (req, res) => ctrl.catalog(req, res, "socialCategories") );
router.get("/religions", (req, res) => ctrl.catalog(req, res, "religions") );
router.get("/maritalStatuses", (req, res) => ctrl.catalog(req, res, "maritalStatuses") );
router.get("/seccCategories", (req, res) => ctrl.catalog(req, res, "seccCategories") );
router.get("/tribalGroups", (req, res) => ctrl.catalog(req, res, "tribalGroups") );
router.get("/hohOptions", (req, res) => ctrl.catalog(req, res, "hohOptions") );
router.get("/pgMappings", (req, res) => ctrl.catalog(req, res, "pgMappings") );
router.get("/valueChains", (req, res) => ctrl.catalog(req, res, "valueChains") );
router.get("/accountTypes", (req, res) => ctrl.catalog(req, res, "accountTypes") );
router.get("/incomeSources", (req, res) => ctrl.catalog(req, res, "incomeSources") );
router.get("/incomeBrackets", (req, res) => ctrl.catalog(req, res, "incomeBrackets") );
router.get("/migrationPurposes", (req, res) => ctrl.catalog(req, res, "migrationPurposes") );
router.get("/wageLabourTypes", (req, res) => ctrl.catalog(req, res, "wageLabourTypes") );
router.get("/nonFarmActivities", (req, res) => ctrl.catalog(req, res, "nonFarmActivities") );
router.get("/sanitationTypes", (req, res) => ctrl.catalog(req, res, "sanitationTypes") );
router.get("/waterSources", (req, res) => ctrl.catalog(req, res, "waterSources") );
router.get("/houseTypes", (req, res) => ctrl.catalog(req, res, "houseTypes") );
router.get("/majorCorps", (req, res) => ctrl.catalog(req, res, "majorCorps") );



// Catalogs (PUT THIS LAST so it doesn't shadow others)
router.get("/catalog/:key", ctrl.catalog);
// or if you prefer /api/options/:key, keep it *after* the above:
// router.get("/:key", ctrl.catalog);

export default router;
