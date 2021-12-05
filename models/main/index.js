const { Router } = require("express");
const router = new Router();

const getTalantInfo = (req) => {
  return req.pool.query("SELECT * FROM talants WHERE user_id = $1;", [req.user.id]);
};

router.get("/", getTalantInfo);

module.exports = router;
