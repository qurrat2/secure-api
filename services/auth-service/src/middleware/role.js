const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role) {
      return res.status(403).json({ message: "Access denied: No role found" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }

    next();
  };
};

module.exports = roleMiddleware;