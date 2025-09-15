/**
 * requireRole("ADMIN") or requireRole(["ADMIN","SUPERADMIN"])
 * - 401 if not authenticated
 * - 403 if authenticated but missing required role(s)
 */
export function requireRole(required) {
  const needed = Array.isArray(required) ? required : [required];

  return (req, res, next) => {
    if (!req.user) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }

    // Normalize roles from req.user
    const roles = (req.user.roles || []).map((r) => String(r).toUpperCase());
    const need = needed.map((r) => String(r).toUpperCase());

    // Allow if any required role is present
    const allowed = need.length === 0 || roles.some((r) => need.includes(r));

    if (!allowed) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    return next();
  };
}
