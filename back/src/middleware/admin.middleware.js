const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.sendStatus(403);
  }
  next();
};

module.exports = requireAdmin;
