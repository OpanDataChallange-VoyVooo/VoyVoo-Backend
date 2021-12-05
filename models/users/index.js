const { Router } = require("express");
const router = new Router();
const UserController = require("./controller");
const auth = require("../../middlewares/auth");

router.get("/", UserController.index);
router.get("/:username", UserController.checkUsername);
router.post("/", UserController.create);
router.post("/login", UserController.login);
router.put("/", auth, UserController.update);
router.post("/verify", auth, UserController.verificationRequest);

module.exports = router;
