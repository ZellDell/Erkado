const cloudinary = require("../cloud/cloudinary.js");
const User = require("../models/users.js");
const {
  FarmerInfo,
  TraderInfo,
  purchasingdetail,
  cropdetail,
} = require("../models/userInfo.js");

bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const jwt = require("jsonwebtoken");

exports.getUserInfo = async (req, res, next) => {
  const userID = req.userId;

  const userCred = await User.findOne({ where: { UserID: userID } });
  console.log("UserType", userCred);
  const { Username, Email, UserType } = userCred;

  let userInfo;

  if (UserType === "Farmer") {
    userInfo = await FarmerInfo.findOne({ where: { UserID: userID } });
  }

  if (UserType === "Trader") {
    userInfo = await TraderInfo.findOne({ where: { UserID: userID } });
  }

  if (userInfo === null) {
    return res
      .status(401)
      .json({ message: "New User", isNewUser: true, UserType });
  }

  console.log("userInfo", userInfo);

  res.status(201).json({
    userInfo,
    UserType,
    Username,
    Email,
  });
};

exports.setUserInfo = async (req, res, next) => {
  const fullname = req.body.fullname;
  const address = req.body.address;
  const extraInfo = req.body.extraInfo;
  const isFarmer = req.body.isFarmer;
  const userID = req.userId;
  const profileImg = req.body.profileImg;
  const crops = req.body.crops;
  console.log("isFarmer :", isFarmer);

  if (!isFarmer) {
    TraderInfo.create({
      UserID: userID,
      Fullname: fullname,
      Address: address,
      TraderType: extraInfo,
      ProfileImg: profileImg,
    })
      .then((result) => {
        const purchasingDetailsPromises = crops.map((crop) => {
          console.log(crop);
          return purchasingdetail.create({
            TraderID: result.TraderID,
            CropID: crop.selectedCrop.CropID,
            PricePerUnit: crop?.price,
          });
        });

        return Promise.all(purchasingDetailsPromises);
      })
      .then((result) => {
        res.status(201).json({ message: "Trader Info has been set", result });
        return;
      })
      .catch((err) => {
        console.error("Error:", err);
        res.status(500).json({ message: "Internal server error" });
      });
    return;
  } else {
    FarmerInfo.create({
      UserID: userID,
      Fullname: fullname,
      Address: address,
      RSBSA: extraInfo,
      ProfileImg: profileImg,
    })
      .then((result) => {
        const cropDetailsPromises = crops.map((crop) => {
          console.log(crop);
          return cropdetail.create({
            FarmerID: result.FarmerID,
            CropID: crop.selectedCrop.CropID,
            Quantity: crop?.quantity,
          });
        });

        return Promise.all(cropDetailsPromises);
      })
      .then((result) => {
        res.status(201).json({ message: "Farmer Info has been set", result });
        return;
      })
      .catch((err) => {
        console.error("Error:", err);
        res.status(500).json({ message: "Internal server error" });
      });
    return;
  }
};

exports.uploadImage = async (req, res) => {
  console.log("req file", req?.file);

  if (!req?.file)
    return res.status(400).json({ error: "Image file is missing!" });

  const imageBuffer = req.file.buffer;

  try {
    const result = await cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, async (error, result) => {
        if (error) {
          console.error("Error uploading image to Cloudinary:", error);
          return res
            .status(500)
            .json({ error: "Error uploading image to Cloudinary" });
        }

        res.status(201).json({
          image: result.secure_url,
          message: "Image uploaded successfully!",
        });
      })
      .end(imageBuffer);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).json({ error: "Error uploading image to Cloudinary" });
  }
};
