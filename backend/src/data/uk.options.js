// backend/src/data/uk.options.js

/* ----------------------------------------------
 * Single data object (geo + cbo + catalogs)
 * --------------------------------------------*/
export const UK = {
  // ---- Geo (district -> blocks -> gps -> villages)
  geo: [
    {
      code: "DDN", name: "Dehradun",
      blocks: [
        {
          code: "DDN-RAI", name: "Raipur",
          gps: [
            {
              code: "GP-RAI-1", name: "Aamwala Tarla",
              villages: [
                { code: "V-RAI-1A", name: "Aamwala" },
                { code: "V-RAI-1B", name: "Tarla Aamwala" },
              ],
            },
            {
              code: "GP-RAI-2", name: "Balawala",
              villages: [
                { code: "V-RAI-2A", name: "Balawala Village" },
                { code: "V-RAI-2B", name: "Nagal Jwalapur" },
              ],
            },
          ],
        },
        {
          code: "DDN-VIK", name: "Vikasnagar",
          gps: [
            {
              code: "GP-VIK-1", name: "Sakhani",
              villages: [{ code: "V-VIK-1A", name: "Sakhani A" }],
            },
            {
              code: "GP-VIK-2", name: "Herbertpur",
              villages: [{ code: "V-VIK-2A", name: "Herbertpur Village" }],
            },
          ],
        },
      ],
    },
    {
      code: "HRD", name: "Haridwar",
      blocks: [
        {
          code: "HRD-LKS", name: "Laksar",
          gps: [
            {
              code: "GP-LKS-1", name: "Sultanpur",
              villages: [
                { code: "V-LKS-1A", name: "Sultanpur A" },
                { code: "V-LKS-1B", name: "Sultanpur B" },
              ],
            },
            { code: "GP-LKS-2", name: "Raiwala Rural", villages: [] },
          ],
        },
        { code: "HRD-BHR", name: "BHEL (Ranipur)", gps: [] },
      ],
    },
    {
      code: "NAI", name: "Nainital",
      blocks: [
        {
          code: "NAI-HLD", name: "Haldwani",
          gps: [
            {
              code: "GP-HLD-1", name: "Motahaldu",
              villages: [
                { code: "V-HLD-1A", name: "Motahaldu East" },
                { code: "V-HLD-1B", name: "Motahaldu West" },
              ],
            },
            { code: "GP-HLD-2", name: "Himmatpur", villages: [] },
          ],
        },
        { code: "NAI-RAM", name: "Ramgarh", gps: [] },
      ],
    },

    // (Add remaining 10 districts when you have the data)
    { code: "ALM", name: "Almora", blocks: [] },
    { code: "BAG", name: "Bageshwar", blocks: [] },
    { code: "CHM", name: "Chamoli", blocks: [] },
    { code: "CHP", name: "Champawat", blocks: [] },
    { code: "PAU", name: "Pauri Garhwal", blocks: [] },
    { code: "PIT", name: "Pithoragarh", blocks: [] },
    { code: "RUD", name: "Rudraprayag", blocks: [] },
    { code: "TEH", name: "Tehri Garhwal", blocks: [] },
    { code: "USN", name: "Udham Singh Nagar", blocks: [] },
    { code: "UTK", name: "Uttarkashi", blocks: [] },
  ],

  // ---- CBO ladder (block -> CLFs -> VOs -> SHGs -> members)
  cbo: [
    {
      block: "DDN-RAI",
      clfs: [
        {
          id: "clf-ddn-rai-1", name: "Raipur CLF 1",
          vos: [
            {
              id: "vo-rai-1a", name: "VO Shyampur A",
              shgs: [
                {
                  id: "shg-rai-1a-1", name: "SHG Pragati",
                  members: [
                    { id: "mem-001", name: "Sunita Devi" },
                    { id: "mem-002", name: "Kamla Devi" },
                  ],
                },
                { id: "shg-rai-1a-2", name: "SHG Ujjwal", members: [{ id: "mem-003", name: "Manju Devi" }] },
              ],
            },
            {
              id: "vo-rai-1b", name: "VO Shyampur B",
              shgs: [{ id: "shg-rai-1b-1", name: "SHG Nari Shakti", members: [{ id: "mem-004", name: "Asha Devi" }] }],
            },
          ],
        },
        {
          id: "clf-ddn-rai-2", name: "Raipur CLF 2",
          vos: [{ id: "vo-rai-2a", name: "VO Balawala A", shgs: [{ id: "shg-rai-2a-1", name: "SHG Lakshmi", members: [{ id: "mem-005", name: "Geeta Devi" }] }] }],
        },
      ],
    },
    {
      block: "DDN-VIK",
      clfs: [{ id: "clf-ddn-vik-1", name: "Vikasnagar CLF 1", vos: [{ id: "vo-vik-1a", name: "VO Herbertpur A", shgs: [{ id: "shg-vik-1a-1", name: "SHG Pragati-2", members: [{ id: "mem-006", name: "Sangeeta" }] }] }] }],
    },
  ],

  // ---- catalogs (all dropdown enums)
  catalogs: {
    yesno: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    rationTypes: [
      { label: "AAY", value: "AAY" },
      { label: "APL", value: "APL" },
      { label: "BPL", value: "BPL" },
      { label: "Others", value: "OTHERS" },
    ],
    educationLevels: [
      { label: "Illiterate", value: "ILLITERATE" },
      { label: "Primary", value: "PRIMARY" },
      { label: "Junior High School", value: "JHS" },
      { label: "High School", value: "HS" },
      { label: "Intermediate", value: "INTERMEDIATE" },
      { label: "Graduate", value: "GRADUATE" },
      { label: "Post Graduate", value: "POSTGRAD" },
    ],
    socialCategories: [
      { label: "General", value: "GEN" },
      { label: "OBC", value: "OBC" },
      { label: "SC", value: "SC" },
      { label: "ST", value: "ST" },
      { label: "Other", value: "OTHER" },
    ],
    religions: [
      { label: "Hindu", value: "Hindu" },
      { label: "Muslim", value: "Muslim" },
      { label: "Christian", value: "Christian" },
      { label: "Other", value: "Other" },
    ],
    majorCorps: [
      { label: "Rice", value: "RICE" },
      { label: "Wheat", value: "WHEAT" },
      { label: "Millets", value: "MILLET" },
      { label: "Other", value: "OTHER" },
    ],
    maritalStatuses: [
      { label: "Single", value: "Single" },
      { label: "Married", value: "Married" },
      { label: "Widowed", value: "Widowed" },
      { label: "Divorced", value: "Divorced" },
    ],
    seccCategories: [
      { label: "Ultra Poor", value: "ULTRA_POOR" },
      { label: "POP", value: "POP" },
      { label: "Poor", value: "POOR" },
    ],
    tribalGroups: [
      { label: "Buksa", value: "BUKSA" },
      { label: "Van-Raji", value: "VAN-RAJI" },
      { label: "Jaunsari", value: "JAUNSARI" },
      { label: "Bhotiya", value: "BHOTIYA" },
      { label: "Tharu", value: "THARU" },
    ],
    hohOptions: [
      { label: "Self", value: "Self" },
      { label: "Husband", value: "Husband" },
      { label: "Son", value: "Son" },
      { label: "Father-in-law", value: "Father-in-law" },
      { label: "Other", value: "Other" },
    ],
    houseTypes: [
      { label: "Kutcha", value: "Kutcha" },
      { label: "Semi-Pucca", value: "Semi-Pucca" },
      { label: "Pucca", value: "Pucca" },
    ],
    waterSources: [
      { label: "Tap", value: "Tap" },
      { label: "Handpump", value: "Handpump" },
      { label: "Spring", value: "Spring" },
      { label: "Well", value: "Well" },
      { label: "River", value: "River" },
      { label: "Other", value: "Other" },
    ],
    sanitationTypes: [
      { label: "Own Toilet", value: "Own Toilet" },
      { label: "Shared", value: "Shared" },
      { label: "Open Defecation", value: "Open Defecation" },
    ],
    nonFarmActivities: [
      { label: "Tailoring", value: "Tailoring" },
      { label: "Handicraft", value: "Handicraft" },
      { label: "Grocery/Retail Shop", value: "Grocery/Retail Shop" },
      { label: "Beauty Parlor", value: "Beauty Parlor" },
      { label: "Masonry", value: "Masonry" },
      { label: "Tea shop", value: "Tea shop" },
      { label: "Eateries", value: "Eateries" },
      { label: "Meat shop", value: "Meat shop" },
      { label: "Carpentry", value: "Carpentry" },
      { label: "Others (specify)", value: "Others" },
    ],
    wageLabourTypes: [
      { label: "Daily", value: "Daily" },
      { label: "Seasonal", value: "Seasonal" },
      { label: "Not engaged", value: "Not engaged" },
    ],
    migrationPurposes: [
      { label: "Work", value: "Work" },
      { label: "Health", value: "Health" },
      { label: "Education", value: "Education" },
      { label: "Displacement", value: "Displacement" },
    ],
    incomeBrackets: [
      { label: "<5000", value: "<5000" },
      { label: "5000–10000", value: "5000-10000" },
      { label: "10000–20000", value: "10000-20000" },
      { label: ">20000", value: ">20000" },
    ],
    incomeSources: [
      { label: "Agriculture", value: "Agriculture" },
      { label: "Livestock", value: "Livestock" },
      { label: "Non-Farm Activity", value: "Non-Farm Activity" },
      { label: "Labour", value: "Labour" },
      { label: "Remittances", value: "Remittances" },
      { label: "Pension", value: "Pension" },
    ],
    accountTypes: [
      { label: "Savings", value: "Savings" },
      { label: "Joint", value: "Joint" },
    ],
    valueChains: [
      { label: "Vegetables", value: "VEG" },
      { label: "Dairy", value: "DAIRY" },
      { label: "Spices", value: "SPICES" },
    ],
    pgMappings: [
      { label: "PG-01 (Raipur)", value: "PG-01" },
      { label: "PG-02 (Vikasnagar)", value: "PG-02" },
    ],
  },
};

/* ----------------------------------------------
 * Indexes for fast lookup (O(1) access)
 * --------------------------------------------*/
export function buildIndexes(uk = UK) {
  const districtIndex = new Map();
  const blockIndex = new Map();
  const gpIndex = new Map();

  const clfsByBlock = new Map();
  const vosByClf = new Map();
  const shgsByVo = new Map();
  const membersByShg = new Map();

  // geo indexes
  for (const d of uk.geo) {
    districtIndex.set(d.code, d);
    for (const b of d.blocks || []) {
      blockIndex.set(b.code, b);
      for (const g of b.gps || []) {
        gpIndex.set(g.code, g);
      }
    }
  }

  // cbo indexes
  for (const row of uk.cbo) {
    clfsByBlock.set(row.block, row.clfs || []);
    for (const clf of row.clfs || []) {
      vosByClf.set(clf.id, clf.vos || []);
      for (const vo of clf.vos || []) {
        shgsByVo.set(vo.id, vo.shgs || []);
        for (const shg of vo.shgs || []) {
          membersByShg.set(shg.id, shg.members || []);
        }
      }
    }
  }

  return { districtIndex, blockIndex, gpIndex, clfsByBlock, vosByClf, shgsByVo, membersByShg };
}

export const IDX = buildIndexes();

/* ----------------------------------------------
 * Tiny helper
 * --------------------------------------------*/
function filterBy(list, q, labelKey = "name") {
  if (!q) return list;
  const n = String(q).toLowerCase();
  return list.filter((it) => String(it[labelKey]).toLowerCase().includes(n));
}

/* ----------------------------------------------
 * Service-style functions (same signatures as before)
 * --------------------------------------------*/
export function listDistricts({ q }) {
  return filterBy(UK.geo.map(({ code, name }) => ({ code, name })), q, "name");
}

export function listBlocks({ district, q }) {
  const d = IDX.districtIndex.get(String(district).toUpperCase());
  const list = d?.blocks || [];
  return filterBy(list, q, "name");
}

export function listGps({ block, q }) {
  const b = IDX.blockIndex.get(block);
  const list = b?.gps || [];
  return filterBy(list, q, "name");
}

export function listVillages({ gp, q }) {
  const g = IDX.gpIndex.get(gp);
  const list = g?.villages || [];
  return filterBy(list, q, "name");
}

// CBO
export function listClfs({ block, q }) {
  return filterBy(IDX.clfsByBlock.get(block) || [], q, "name");
}
export function listVos({ clf, q }) {
  return filterBy(IDX.vosByClf.get(clf) || [], q, "name");
}
export function listShgs({ vo, q }) {
  return filterBy(IDX.shgsByVo.get(vo) || [], q, "name");
}
export function listShgMembers({ shg, q }) {
  return filterBy(IDX.membersByShg.get(shg) || [], q, "name");
}
export function listRationTypes({ shg, q }) {
  const list = UK.catalogs["rationTypes"] || [];
  return filterBy(list, q, "label");
}

// Catalogs (label/value)
export function listCatalog(key, { q }) {
  const list = UK.catalogs[key] || [];
  console.log("listCatalog", key, list.length);
  if (!q) return list;
  const needle = String(q).toLowerCase();
  return list.filter((o) => String(o.label).toLowerCase().includes(needle));
}
