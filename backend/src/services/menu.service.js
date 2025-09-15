// ---- SRS-aligned, role-aware menu builder (with 150 item padding) ----

// Helpers
function countItems(list){ let n=0; for(const it of list||[]){ n++; if(Array.isArray(it.children)) n+=countItems(it.children);} return n; }
const hasAnyRole = (user, roles=[]) => !!roles.find(r => user?.roles?.includes(r));
const byPath = (path) => ({ path });
const as = (label, path, extras={}) => ({ label, path, ...extras });

// Access matrix (visibility only; CRUD handled inside app RBAC)
const ACCESS = {
  admin: ["user","enterprise","livelihood","infrastructure","finance","training","linedept","reports","dashboards","masters"],
  pmu:   ["user","enterprise","livelihood","infrastructure","finance","training","linedept","reports","dashboards"],
  dpmu:  ["user","enterprise","livelihood","infrastructure","finance","training","linedept","reports","dashboards"],
  block: ["user","enterprise","livelihood","infrastructure","finance","training","reports"], // dashboards if scoped, include if needed
  clf:   ["user","enterprise","livelihood","infrastructure","training","reports"],
  ldu:   ["linedept","reports"], // Line Department User
};

function allowed(user, key){
  // admin overrides
  if (hasAnyRole(user, ["admin"])) return true;
  const all = Object.entries(ACCESS).flatMap(([role,mods]) => user?.roles?.includes(role) ? mods : []);
  return all.includes(key);
}

// Phase-1 modules & forms (paths are suggestions—align with your routes)
const MODULES = [
  {
    key: "user",
    label: "User Data Updation",
    icon: "users",
    children: [
      as("Beneficiary Member Profile", "/member/user/memberdetails"),
      as("SHG Profile Update", "/member/user/shg"),
      as("VO Profile Update", "/member/user/vo"),
      as("CLF/LC Profile Update", "/member/user/clf-lc"),
      as("Leader Profile Update", "/member/user/leader"),
      as("Shareholder Profile Update", "/member/user/shareholder"),
      as("FPO Profile Update", "/member/user/fpo"),
      as("PG Profile Update", "/member/user/pg"),
      as("LC → CLF Conversion", "/member/user/lc-to-clf"),
    ],
  },
  {
    key: "enterprise",
    label: "Enterprise Data Updation",
    icon: "briefcase",
    children: [
      as("Create/Update Enterprise Activity", "/data/enterprise/activity"),
      as("Enterprise Activity Outcome", "/data/enterprise/outcome"),
      as("CLF/LC Monthly Business Update", "/data/enterprise/monthly-business"),
    ],
  },
  {
    key: "livelihood",
    label: "Livelihood Data Updation",
    icon: "leaf",
    children: [
      as("Ultra-Poor Activity Update", "/data/livelihood/ultra-poor"),
      as("Ultra-Poor Outcome Update", "/data/livelihood/ultra-poor-outcome"),
      as("Drudgery Reduction Update", "/data/livelihood/drudgery"),
      as("Pashu Sakhi Data Update", "/data/livelihood/pashu-sakhi"),
      as("CSA Seed Data Update", "/data/livelihood/csa-seed"),
    ],
  },
  {
    key: "infrastructure",
    label: "Infrastructure Data Updation",
    icon: "tools",
    children: [
      as("Infrastructure Entry", "/data/infrastructure/entry"),
      as("Infrastructure Update", "/data/infrastructure/update"),
    ],
  },
  {
    key: "finance",
    label: "Finance Data Updation",
    icon: "rupee",
    children: [
      as("Finance Data Entry (Individual)", "/data/finance/individual"),
      as("Finance Data Entry (CBO)", "/data/finance/cbo"),
    ],
  },
  {
    key: "training",
    label: "Training & KM",
    icon: "graduation-cap",
    children: [
      as("Training Program Entry", "/data/training/program"),
      as("Training Outcome Entry", "/data/training/outcome"),
    ],
  },
  // Line Department module is kept separate to also serve padding below
  // {
  //   key: "linedept",
  //   label: "Line Departments",
  //   icon: "layers",
  //   children: [
  //     // You can pre-seed a few known departments; padding will append more.
  //     as("Agriculture", "/dept/d001"),
  //     as("Animal Husbandry", "/dept/d002"),
  //     as("Horticulture", "/dept/d003"),
  //   ],
  // },
];

// Admin/Masters section
function mastersSection(user){
  if (!allowed(user, "masters") && !hasAnyRole(user, ["admin"])) return null;
  return {
    label: "Admin & Masters",
    icon: "settings",
    children: [
      as("User Management", "/admin/users"),
      as("Role Mapping", "/admin/roles"),
      as("Geo Masters (District/Block/GP/Village)", "/masters/geo"),
      as("Institution Masters (CLF/VO/SHG/FPO/PG)", "/masters/institutions"),
      as("Value Chain Master", "/masters/value-chains"),
      as("Bank Master", "/masters/banks"),
      as("Enterprise Types", "/masters/enterprise-types"),
    ],
  };
}

function reportsSection(user){
  if (!allowed(user, "reports")) return null;
  return {
    label: "MIS Reports",
    icon: "report",
    children: [
      as("Module-wise Reports", "/reports/modules"),
      as("Finance Reports", "/reports/finance"),
      as("Training Reports", "/reports/training"),
      as("Enterprise Reports", "/reports/enterprise"),
      as("Livelihood Reports", "/reports/livelihood"),
      as("Custom Exports", "/reports/exports"),
    ],
  };
}

function dashboardsSection(user){
  if (!allowed(user, "dashboards")) return null;
  return {
    label: "Dashboards",
    icon: "dashboard",
    children: [
      as("Overview Dashboard", "/dashboards/overview"),
      as("Enterprise Dashboard", "/dashboards/enterprise"),
      as("Training Dashboard", "/dashboards/training"),
      as("Finance Dashboard", "/dashboards/finance"),
      as("Livelihood Dashboard", "/dashboards/livelihood"),
    ],
  };
}

// Build SRS-aware base menu
function baseMenuFor(user){
  const base = [
    // { label: "Home", icon: "home", path: "/" },
    // Helpful quick links
    // { label: "Docs (external)", icon: "external", url: "https://example.com/docs" },
  ];

  // Phase-1 modules filtered by role visibility
  for (const mod of MODULES){
    if (allowed(user, mod.key)){
      // Clone shallow to avoid sharing references across users
      base.push({ label: mod.label, icon: mod.icon, children: [...(mod.children||[])] });
    }
  }

  // Admin/Masters (for admin & pmu if you want)
  // const masters = mastersSection(user);
  // if (masters) base.push(masters);

  // Phase-2 nav (visible where applicable)
  // const reports = reportsSection(user);
  // if (reports) base.push(reports);

  // const dashboards = dashboardsSection(user);
  // if (dashboards) base.push(dashboards);

  return base;
}

// Keep your padding behavior (ensures massive menu performance tests, etc.)
function padMenuToTarget(menu, targetCount){
  const totalNow = countItems(menu);
  const needed = Math.max(0, targetCount - totalNow);
  if(!needed) return menu;
  // Find the Line Departments node (it exists if visible for the role)
  const line = menu.find(m => m.label==="Line Departments" && Array.isArray(m.children));
  if(!line) return menu;
  const start = line.children.length + 1;
  for(let i=0;i<needed;i++){
    const idx = start + i;
    const code = String(idx).padStart(3,"0");
    line.children.push({ label: `Department ${idx}`, icon: "layers", path: `/dept/d${code}`});
  }
  return menu;
}

const menuCache = new Map(); // key: userId|roles|target

export const MenuService = {
  get(user, target=150){
    const rolesKey = (user?.roles||[]).sort().join(",");
    const k = `${user?.id||"anon"}|${rolesKey}|${target}`;
    if(menuCache.has(k)){
      const m = menuCache.get(k);
      return { total: countItems(m), menu: m };
    }
    const base = baseMenuFor(user);
    const menu = padMenuToTarget(base, target);
    menuCache.set(k, menu);
    return { total: countItems(menu), menu };
  }
};
