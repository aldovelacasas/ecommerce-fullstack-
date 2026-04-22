const roleMiddleware = (roleRequired) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || user.role !== roleRequired) {
      return res.status(403).json({
        message: "No tienes permisos para esta acción"
      });
    }

    next();
  };
};

module.exports = roleMiddleware;