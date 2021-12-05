const jwt = require("jsonwebtoken");
const { APP } = require("../config/env");

module.exports = function (req, res, next) {
  if (req.headers.token) {
    jwt.verify(req.headers.token, APP.SECRET, (err, decoded) => {
      if (err) return res.send({ status: 401, message: "Unauthorized" });
      req.user = decoded;
      next();
    });
  } else {
    res.send({ status: 401, message: "Unauthorized" });
  }
};
