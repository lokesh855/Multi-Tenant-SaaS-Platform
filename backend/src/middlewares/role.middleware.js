const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log(allowedRoles);
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!allowedRoles[0].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Forbidden: insufficient role and role is ${allowedRoles}`});
    }
    next();
  };
};

module.exports = authorizeRoles;
