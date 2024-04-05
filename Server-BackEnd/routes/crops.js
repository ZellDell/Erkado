const multer = require("multer");

const upload = multer();

const path = require("path");
const multers = require("../middleware/multer");
const express = require("express");

const cropController = require("../controllers/crops");
const isAuth = require("../middleware/is-Auth");

const router = express.Router();

router.get("/", cropController.getCrops);

module.exports = router;
