export {
  listDistricts,
  listBlocks,
  listGps,
  listVillages,
  listClfs,
  listVos,
  listShgs,
  listShgMembers,

  // generic catalogs (label/value)
  listCatalog,
  listRationTypes,
} from "../data/uk.options.js";

// Simple contains/starts-with matcher for ?q= search
// function matchQuery(list, q, labelKey = "name") {
//   if (!q) return list;
//   const needle = String(q).toLowerCase();
//   return list.filter((o) => String(o[labelKey]).toLowerCase().includes(needle));
// }

// export function listDistricts({ q }) {
//   return matchQuery(districts, q, "name");
// }

// export function listBlocks({ district, q }) {
//   const key = String(district || "").toUpperCase();
//   const list = blocksByDistrict[key] || [];
//   return matchQuery(list, q, "name");
// }

// export function listGps({ block, q }) {
//   const list = gpsByBlock[block] || [];
//   return matchQuery(list, q, "name");
// }

// export function listVillages({ gp, q }) {
//   const list = villagesByGp[gp] || [];
//   return matchQuery(list, q, "name");
// }

// // CBO ladders
// export function listClfs({ block, q }) {
//   const list = clfsByBlock[block] || [];
//   return matchQuery(list, q, "name");
// }

// export function listVos({ clf, q }) {
//   const list = vosByClf[clf] || [];
//   return matchQuery(list, q, "name");
// }

// export function listShgs({ vo, q }) {
//   const list = shgsByVo[vo] || [];
//   return matchQuery(list, q, "name");
// }

// export function listShgMembers({ shg, q }) {
//   const list = membersByShg[shg] || [];
//   return matchQuery(list, q, "name");
// }

// // Catalog readers (all support ?q= on label)
// function filterByLabel(list, q) {
//   if (!q) return list;
//   const needle = String(q).toLowerCase();
//   return list.filter((o) => String(o.label).toLowerCase().includes(needle));
// }

// export function listCatalog(key, { q }) {
//   const map = {
//     yesno: C.yesNo,
//     rationTypes: C.rationTypes,
//     educationLevels: C.educationLevels,
//     socialCategories: C.socialCategories,
//     religions: C.religions,
//     maritalStatuses: C.maritalStatuses,
//     seccCategories: C.seccCategories,
//     tribalGroups: C.tribalGroups,
//     hohOptions: C.hohOptions,
//     houseTypes: C.houseTypes,
//     waterSources: C.waterSources,
//     sanitationTypes: C.sanitationTypes,
//     nonFarmActivities: C.nonFarmActivities,
//     wageLabourTypes: C.wageLabourTypes,
//     migrationPurposes: C.migrationPurposes,
//     incomeBrackets: C.incomeBrackets,
//     incomeSources: C.incomeSources,
//     accountTypes: C.accountTypes,
//     valueChains: C.valueChains,
//     pgMappings: C.pgMappings,
//   };
//   return filterByLabel(map[key] || [], q);
// }
