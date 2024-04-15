const multer = require("multer");

const upload = multer();

const path = require("path");
const multers = require("../middleware/multer");
const express = require("express");

const transactionController = require("../controllers/transaction");
const isAuth = require("../middleware/is-Auth");

const router = express.Router();

router.get("/", isAuth, transactionController.getTransaction);
router.post(
  "/offer",
  isAuth,
  upload.none(),
  transactionController.sendTransactionOffer
);
router.post(
  "/confirm",

  upload.none(),
  transactionController.confirmTransaction
);

router.post(
  "/complete",

  upload.none(),
  transactionController.completeTransaction
);

router.post(
  "/access",
  upload.none(),
  transactionController.setTransactionViewAccess
);

module.exports = router;
