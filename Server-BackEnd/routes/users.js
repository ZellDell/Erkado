const multer = require("multer");

const upload = multer();

const path = require("path");

const express = require("express");

const userController = require("../controllers/users");
const isAuth = require("../middleware/is-Auth");

const router = express.Router();

router.post("/register", upload.none(), userController.userRegister);

router.post("/login", upload.none(), userController.userLogin);

module.exports = router;
