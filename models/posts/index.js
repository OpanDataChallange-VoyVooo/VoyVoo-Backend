const { Router } = require("express");
const router = new Router();
const Controller = require("./controller");

router.get("/", Controller.getUserPosts);
router.post("/request", Controller.createPostRequest);

module.exports = router;
