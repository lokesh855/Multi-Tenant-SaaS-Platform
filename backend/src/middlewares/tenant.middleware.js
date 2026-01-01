const tenantIsolation = (modelName) => {
  return async (req, res, next) => {
    if (req.user.role === "super_admin") {
      return next();
    }

    if (!req.user.tenantId) {
      return res.status(403).json({ success: false, message: "Tenant not found" });
    }

    req.tenantFilter = { tenantId: req.user.tenantId };
    next();
  };
};

module.exports = tenantIsolation;
