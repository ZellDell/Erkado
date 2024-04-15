const multer = require("multer");

const upload = multer();

const path = require("path");
const multers = require("../middleware/multer");
const express = require("express");

const userInfoController = require("../controllers/userInfo");
const isAuth = require("../middleware/is-Auth");

const router = express.Router();

router.get("/", isAuth, upload.none(), userInfoController.getUserInfo);
router.post("/setInfo", isAuth, upload.none(), userInfoController.setUserInfo);
router.post(
  "/update",
  isAuth,
  upload.none(),
  userInfoController.updateCropInfo
);
router.post(
  "/updateInfo",
  isAuth,
  upload.none(),
  userInfoController.updateUserInfo
);

router.post(
  "/upload-image",
  upload.single("image"),
  userInfoController.uploadImage
);
module.exports = router;
