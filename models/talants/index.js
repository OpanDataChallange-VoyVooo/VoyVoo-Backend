const { Router } = require("express");
const { aws_uploader } = require("../../middlewares/aws_uploader");
const isTalant = require("../../middlewares/isTalant");
const router = new Router();
const TalantController = require("./controller");

router.use(isTalant);
router.get("/", TalantController.index);
router.put("/", TalantController.updateTalantInfo);
router.put("/pic", aws_uploader, TalantController.updateTalantPic);
router.put("/media", aws_uploader, TalantController.updateTalantMedia);
router.post("/portfolio", aws_uploader, TalantController.portfolio);
router.post("/post", aws_uploader, TalantController.post);

module.exports = router;
