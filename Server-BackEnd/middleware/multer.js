const multer = require("multer");

const storage = multer.diskStorage({});

const fileFilter = (req, image, cb) => {
  console.log("image: ", image);
  if (!image.mimetype.includes("image")) {
    return cb("Invalid image format! ", false);
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
