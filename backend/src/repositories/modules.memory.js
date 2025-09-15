// Simple in-memory repo (swap with DB later). Seed per tenant.
const _store = new Map(); // key: tenant -> Map(id -> module)

function ensureTenant(tenant) {
  const t = tenant || "uk";
  if (!_store.has(t)) _store.set(t, new Map());
  return t;
}
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const ModulesRepo = {
  seed(tenant, items = []) {
    const t = ensureTenant(tenant);
    const bucket = _store.get(t);
    items.forEach((m) => {
      const id = m.id || uid();
      bucket.set(id, { id, tenant: t, ...m });
    });
  },

  list({ tenant, q, page = 1, limit = 50 }) {
    const t = ensureTenant(tenant);
    const bucket = _store.get(t);
    let arr = Array.from(bucket.values());
    if (q) {
      const s = q.toLowerCase();
      arr = arr.filter(
        (m) =>
          m.title?.toLowerCase().includes(s) ||
          m.description?.toLowerCase().includes(s) ||
          m.code?.toLowerCase().includes(s)
      );
    }
    const total = arr.length;
    const start = (page - 1) * limit;
    const data = arr.slice(start, start + limit);
    return { data, page, limit, total };
  },

  create(tenant, payload) {
    const t = ensureTenant(tenant);
    const bucket = _store.get(t);
    const id = uid();
    const doc = { id, tenant: t, ...payload };
    bucket.set(id, doc);
    return doc;
  },

  update(tenant, id, patch) {
    const t = ensureTenant(tenant);
    const bucket = _store.get(t);
    const prev = bucket.get(id);
    if (!prev) return null;
    const next = { ...prev, ...patch, id, tenant: t };
    bucket.set(id, next);
    return next;
  },

  remove(tenant, id) {
    const t = ensureTenant(tenant);
    const bucket = _store.get(t);
    const existed = bucket.get(id);
    if (!existed) return null;
    bucket.delete(id);
    return existed;
  },
};

// Seed a few defaults for 'uk'
ModulesRepo.seed("uk", [
  // Phase 1: Core Data Updation Modules
  {
    code: "user-data",
    title: "User Data Updation",
    description: "Manage SHG Members, VO, CLF, FPO, PG profiles & LC to CLF conversion.",
    icon: "Groups",
    gradient: "linear-gradient(135deg, #7ED957 0%, #3BB273 100%)",
    path: "/user-data",
    imageUrl: "/assets/icons/user-data.svg",

    // New Fields
    count: 0, // backend will populate real value
    lastUpdated: null, // ISO date string; update after API call
    quickActions: [
      { icon: "Add", label: "Add New", action: "/user-data/new" },
      { icon: "Visibility", label: "View All", action: "/user-data/list" },
      { icon: "Edit", label: "Update", action: "/user-data/update" },
    ],
  },
  {
    code: "enterprise",
    title: "Enterprise Data",
    description: "Create, update, and track enterprise activities and outcomes.",
    icon: "BusinessCenter",
    gradient: "linear-gradient(135deg, #FBD163 0%, #DE8F39 100%)",
    path: "/enterprise",
    imageUrl: "/assets/icons/enterprise.svg",
    count: 0,
    lastUpdated: null,
    quickActions: [
      { icon: "Add", label: "Add Activity", action: "/enterprise/add" },
      { icon: "BarChart", label: "View Outcomes", action: "/enterprise/outcomes" },
    ],
  },
  {
    code: "livelihood",
    title: "Livelihood Data",
    description: "Capture ultra-poor interventions, drudgery reduction, livestock, CSA seed data.",
    icon: "Agriculture",
    gradient: "linear-gradient(135deg, #56AB2F 0%, #A8E063 100%)",
    path: "/livelihood",
    imageUrl: "/assets/icons/livelihood.svg",
    count: 0,
    lastUpdated: null,
    quickActions: [
      { icon: "Add", label: "Add Activity", action: "/livelihood/add" },
      { icon: "Edit", label: "Update", action: "/livelihood/update" },
    ],
  },
  {
    code: "infrastructure",
    title: "Infrastructure",
    description: "Record community assets, infrastructure projects & facilities.",
    icon: "Apartment",
    gradient: "linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)",
    path: "/infrastructure",
    imageUrl: "/assets/icons/infrastructure.svg",
    count: 0,
    lastUpdated: null,
    quickActions: [
      { icon: "Add", label: "Add Asset", action: "/infrastructure/add" },
      { icon: "Visibility", label: "View Assets", action: "/infrastructure/list" },
    ],
  },
  {
    code: "finance",
    title: "Finance Data",
    description: "Track financial disbursement, equity contributions, CIF utilization.",
    icon: "AccountBalance",
    gradient: "linear-gradient(135deg, #0BA360 0%, #3CBA92 100%)",
    path: "/finance",
    imageUrl: "/assets/icons/finance.svg",
    count: 0,
    lastUpdated: null,
    quickActions: [
      { icon: "Add", label: "Add Record", action: "/finance/add" },
      { icon: "BarChart", label: "Reports", action: "/finance/reports" },
    ],
  },
  {
    code: "training",
    title: "Training & Knowledge",
    description: "Capture training programs, attendance, outcomes & knowledge sessions.",
    icon: "School",
    gradient: "linear-gradient(135deg, #F6D365 0%, #FDA085 100%)",
    path: "/training",
    imageUrl: "/assets/icons/training.svg",
    count: 0,
    lastUpdated: null,
    quickActions: [
      { icon: "Add", label: "Add Training", action: "/training/add" },
      { icon: "Visibility", label: "View Sessions", action: "/training/list" },
    ],
  },
  {
    code: "line-dept",
    title: "Line Departments",
    description: "Department-specific data entry for Agriculture, Animal Husbandry, etc.",
    icon: "AccountTree",
    gradient: "linear-gradient(135deg, #C3F0CA 0%, #5FB878 100%)",
    path: "/line-dept",
    imageUrl: "/assets/icons/line-dept.svg",
    count: 0,
    lastUpdated: null,
    quickActions: [
      { icon: "Add", label: "Add Dept Data", action: "/line-dept/add" },
      { icon: "Visibility", label: "View Reports", action: "/line-dept/reports" },
    ],
  },

  // Phase 2: Dashboards & MIS Reports
  // {
  //   code: "dashboards",
  //   title: "Dashboards",
  //   description: "Real-time performance KPIs, charts, and geo-visualization.",
  //   icon: "Dashboard",
  //   gradient: "linear-gradient(135deg, #C6FFDD 0%, #FBD786 100%)",
  //   path: "/dashboards",
  //   imageUrl: "/assets/icons/dashboards.svg",
  //   count: 0,
  //   lastUpdated: null,
  //   quickActions: [
  //     { icon: "BarChart", label: "View KPIs", action: "/dashboards" },
  //   ],
  // },
  {
    code: "mis-reports",
    title: "MIS Reports",
    description: "Generate and export module-wise performance and financial reports.",
    icon: "Assessment",
    gradient: "linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)",
    path: "/mis-reports",
    imageUrl: "/assets/icons/mis-reports.svg",
    count: 0,
    lastUpdated: null,
    quickActions: [
      { icon: "Download", label: "Export", action: "/mis-reports/export" },
      { icon: "Visibility", label: "View Reports", action: "/mis-reports/list" },
    ],
  },
]);

