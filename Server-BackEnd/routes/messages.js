const multer = require("multer");

const upload = multer();

const path = require("path");
const multers = require("../middleware/multer");
const express = require("express");

const msgController = require("../controllers/messages");
const isAuth = require("../middleware/is-Auth");

const router = express.Router();

router.get("/", upload.none(), isAuth, msgController.getConversation);
router.get("/send", upload.none(), msgController.sendMessage);

module.exports = router;
