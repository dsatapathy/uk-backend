export const ok = (res, data, meta) => {
  if (meta) {
    const payload = Array.isArray(data)
      ? { menu: data, meta }         // arrays → wrap under a key
      : { ...data, meta };           // objects → shallow-merge
    return res.json(payload);
  }
  return res.json(data);             // no meta → pass through
};

export const created = (res, data, meta) => {
  if (meta) {
    const payload = Array.isArray(data)
      ? { menu: data, meta }
      : { ...data, meta };
    return res.status(201).json(payload);
  }
  return res.status(201).json(data);
};

export const bad = (res, msg = "Bad request") => res.status(400).json({ error: msg });
export const unauthorized = (res, msg = "Unauthorized") => res.status(401).json({ error: msg });
export const notfound = (res, msg = "Not found") => res.status(404).json({ error: msg });
