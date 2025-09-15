// Minimal-but-real seed data for Uttarakhand
// Expand these maps over time (only services need to read them).

export const districts = [
  { code: "ALM", name: "Almora" },
  { code: "BAG", name: "Bageshwar" },
  { code: "CHM", name: "Chamoli" },
  { code: "CHP", name: "Champawat" },
  { code: "DDN", name: "Dehradun" },
  { code: "HRD", name: "Haridwar" },
  { code: "NAI", name: "Nainital" },
  { code: "PAU", name: "Pauri Garhwal" },
  { code: "PIT", name: "Pithoragarh" },
  { code: "RUD", name: "Rudraprayag" },
  { code: "TEH", name: "Tehri Garhwal" },
  { code: "USN", name: "Udham Singh Nagar" },
  { code: "UTK", name: "Uttarkashi" },
];

// Blocks by district (demo coverage; add more as needed)
export const blocksByDistrict = {
  DDN: [
    { code: "DDN-RAI", name: "Raipur" },
    { code: "DDN-VIK", name: "Vikasnagar" },
  ],
  HRD: [
    { code: "HRD-LKS", name: "Laksar" },
    { code: "HRD-BHR", name: "Bharat Heavy Electricals (Ranipur)" },
  ],
  NAI: [
    { code: "NAI-HLD", name: "Haldwani" },
    { code: "NAI-RAM", name: "Ramgarh" },
  ],
  // …fill out other districts over time
};

// GPs by block
export const gpsByBlock = {
  "DDN-RAI": [
    { code: "GP-RAI-1", name: "Aamwala Tarla" },
    { code: "GP-RAI-2", name: "Balawala" },
  ],
  "DDN-VIK": [
    { code: "GP-VIK-1", name: "Sakhani" },
    { code: "GP-VIK-2", name: "Herbertpur" },
  ],
  "HRD-LKS": [
    { code: "GP-LKS-1", name: "Sultanpur" },
    { code: "GP-LKS-2", name: "Raiwala Rural" },
  ],
  "NAI-HLD": [
    { code: "GP-HLD-1", name: "Motahaldu" },
    { code: "GP-HLD-2", name: "Himmatpur" },
  ],
};

// Villages by GP
export const villagesByGp = {
  "GP-RAI-1": [
    { code: "V-RAI-1A", name: "Aamwala" },
    { code: "V-RAI-1B", name: "Tarla Aamwala" },
  ],
  "GP-RAI-2": [
    { code: "V-RAI-2A", name: "Balawala Village" },
    { code: "V-RAI-2B", name: "Nagal Jwalapur" },
  ],
  "GP-LKS-1": [
    { code: "V-LKS-1A", name: "Sultanpur A" },
    { code: "V-LKS-1B", name: "Sultanpur B" },
  ],
  "GP-HLD-1": [
    { code: "V-HLD-1A", name: "Motahaldu East" },
    { code: "V-HLD-1B", name: "Motahaldu West" },
  ],
};

// CBO hierarchy (demo). In real life you’ll fetch from DB.
export const clfsByBlock = {
  "DDN-RAI": [
    { id: "clf-ddn-rai-1", name: "Raipur CLF 1" },
    { id: "clf-ddn-rai-2", name: "Raipur CLF 2" },
  ],
  "DDN-VIK": [{ id: "clf-ddn-vik-1", name: "Vikasnagar CLF 1" }],
};

export const vosByClf = {
  "clf-ddn-rai-1": [
    { id: "vo-rai-1a", name: "VO Shyampur A" },
    { id: "vo-rai-1b", name: "VO Shyampur B" },
  ],
  "clf-ddn-rai-2": [{ id: "vo-rai-2a", name: "VO Balawala A" }],
  "clf-ddn-vik-1": [{ id: "vo-vik-1a", name: "VO Herbertpur A" }],
};

export const shgsByVo = {
  "vo-rai-1a": [
    { id: "shg-rai-1a-1", name: "SHG Pragati" },
    { id: "shg-rai-1a-2", name: "SHG Ujjwal" },
  ],
  "vo-rai-1b": [{ id: "shg-rai-1b-1", name: "SHG Nari Shakti" }],
  "vo-rai-2a": [{ id: "shg-rai-2a-1", name: "SHG Lakshmi" }],
  "vo-vik-1a": [{ id: "shg-vik-1a-1", name: "SHG Pragati-2" }],
};

export const membersByShg = {
  "shg-rai-1a-1": [
    { id: "mem-001", name: "Sunita Devi" },
    { id: "mem-002", name: "Kamla Devi" },
  ],
  "shg-rai-1a-2": [{ id: "mem-003", name: "Manju Devi" }],
  "shg-rai-1b-1": [{ id: "mem-004", name: "Asha Devi" }],
  "shg-rai-2a-1": [{ id: "mem-005", name: "Geeta Devi" }],
  "shg-vik-1a-1": [{ id: "mem-006", name: "Sangeeta" }],
};
