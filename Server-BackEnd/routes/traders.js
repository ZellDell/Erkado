const multer = require("multer");

const upload = multer();

const path = require("path");
const multers = require("../middleware/multer");
const express = require("express");

const traderController = require("../controllers/traders");
const isAuth = require("../middleware/is-Auth");

const router = express.Router();

router.get("/search", upload.none(), traderController.queryTraders);

module.exports = router;
