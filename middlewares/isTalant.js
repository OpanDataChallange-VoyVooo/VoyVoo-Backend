module.exports = (req, res, next) => {
  if (req.user.is_talant) return next();
  return res.send({ status: 409, message: "This method is only for talants" });
};
