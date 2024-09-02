const cloudinary = require("../cloud/cloudinary.js");
const User = require("../models/users.js");
const {
  FarmerInfo,
  TraderInfo,
  purchasingdetail,
} = require("../models/userInfo.js");
const { crops, qualitytype } = require("../models/crops.js");

bcrypt = require("bcryptjs");
const { Op, where } = require("sequelize");

const jwt = require("jsonwebtoken");

exports.getUserInfo = async (req, res, next) => {
  const userID = req.userId;

  const userCred = await User.findOne({ where: { UserID: userID } });

  const { Username, Email, UserType } = userCred;

  let userInfo;
  let purchasingDetails;

  try {
    if (UserType === "Farmer") {
      userInfo = await FarmerInfo.findOne({ where: { UserID: userID } });
    }

    if (UserType === "Trader") {
      userInfo = await TraderInfo.findOne({ where: { UserID: userID } });

      if (userInfo) {
        purchasingDetails = await purchasingdetail.findAll({
          where: { TraderID: userInfo.dataValues.TraderID },
        });
      }

      if (purchasingDetails) {
        for (const detail of purchasingDetails) {
          const quality = await qualitytype.findAll({
            where: {
              QualityTypeID: detail.QualityTypeID,
            },
          });
          console.log(quality);
          detail.dataValues.Quality = quality;
        }
      }
    }

    if (userInfo === null) {
      return res
        .status(401)
        .json({ message: "New User", isNewUser: true, UserType });
    }

    console.log("userInfo", userInfo);
    console.log("purchasingDetails", purchasingDetails);
    res.status(201).json({
      userInfo,
      purchasingDetails,
      UserType,
      Username,
      Email,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.setUserInfo = async (req, res, next) => {
  const fullname = req.body.fullname;
  const address = req.body.address;
  const extraInfo = req.body.extraInfo;
  const isFarmer = req.body.isFarmer;
  const userID = req.userId;
  const profileImg = req.body.profileImg;
  const crops = req.body.crops;

  if (!isFarmer) {
    TraderInfo.create({
      UserID: userID,
      Fullname: fullname,
      Address: address,
      TraderType: extraInfo,
      ProfileImg: profileImg,
    })
      .then((result) => {
        console.log("=============", result);
        if (crops.length > 0) {
          const purchasingDetailsPromises = crops.map((crop) => {
            return purchasingdetail.create({
              TraderID: result.TraderID,
              CropID: crop.selectedCrop.CropID,
              PricePerUnit: crop?.Price,
              CropType: crop?.CropType,
              QualityTypeID: crop?.QualityTypeID,
            });
          });

          return Promise.all(purchasingDetailsPromises);
        }
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

// exports.updateCropInfo = async (req, res, next) => {
//   const userID = req.userId;

//   const newCrops = req.body.myCrops;

//   try {
//     // Retrieve existing purchasing details
//     const existingPurchasingDetails = await purchasingdetail.findAll({
//       where: { TraderID: userID },
//     });

//     // Identify changes
//     const existingCropMap = new Map(
//       existingPurchasingDetails.map((detail) => [detail.CropID, detail])
//     );

//     const toCreate = [];
//     const toUpdate = [];
//     const toRemove = [];

//     newCrops.forEach((newCrop) => {
//       const existingDetail = existingCropMap.get(newCrop.selectedCrop.CropID);
//       if (existingDetail) {
//         // Check for updates
//         if (
//           existingDetail.PricePerUnit !== newCrop.Price ||
//           existingDetail.CropType !== newCrop.CropType ||
//           existingDetail.QualityTypeID !== newCrop.QualityTypeID
//         ) {
//           toUpdate.push({ ...existingDetail, ...newCrop });
//         }
//         existingCropMap.delete(newCrop.selectedCrop.CropID);
//       } else {
//         // New crop
//         toCreate.push({
//           TraderID: userID,
//           CropID: newCrop.selectedCrop.CropID,
//           PricePerUnit: newCrop.Price,
//           CropType: newCrop.CropType,
//           QualityTypeID: newCrop.QualityTypeID,
//         });
//       }
//     });

//     toRemove.push(...existingCropMap.values());

//     // Perform updates

//     for (const detail of toUpdate) {
//       await detail.update({
//         PricePerUnit: detail.Price,
//         CropType: detail.CropType,
//         QualityTypeID: detail.QualityTypeID,
//       });
//     }

//     // Create new entries
//     await purchasingdetail.bulkCreate(toCreate);

//     // Remove entries
//     for (const detail of toRemove) {
//       await detail.destroy();
//     }

//     res
//       .status(200)
//       .json({ message: "Purchasing details updated successfully" });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.updateCropInfo = async (req, res, next) => {
  const userID = req.userId;
  const newCrops = req.body.myCrops;

  try {
    userInfo = await TraderInfo.findOne({ where: { UserID: userID } });
    // Fetch all purchasing details that match the userID
    const existingPurchasingDetails = await purchasingdetail.findAll({
      where: { TraderID: userInfo.dataValues.TraderID },
    });

    // Map existing purchasing details by CropID
    const existingCropMap = new Map(
      existingPurchasingDetails.map((detail) => [detail.CropID, detail])
    );

    // Initialize arrays for changes
    const toCreate = [];
    const toUpdate = [];
    const toRemove = [];

    // Iterate through new crops
    newCrops.forEach((newCrop) => {
      const existingDetail = existingCropMap.get(newCrop.selectedCrop.CropID);
      if (existingDetail) {
        // Check for updates
        if (
          existingDetail.PricePerUnit !== newCrop.Price ||
          existingDetail.CropType !== newCrop.CropType ||
          existingDetail.QualityTypeID !== newCrop.QualityTypeID
        ) {
          // Update existing entry
          toUpdate.push({ ...existingDetail, ...newCrop });
        }
        // Remove from map as it's handled
        existingCropMap.delete(newCrop.selectedCrop.CropID);
      } else {
        // New crop, add to creation list
        toCreate.push({
          TraderID: userInfo.dataValues.TraderID,
          CropID: newCrop.selectedCrop.CropID,
          PricePerUnit: newCrop.Price,
          CropType: newCrop.CropType,
          QualityTypeID: newCrop.QualityTypeID,
        });
      }
    });

    // Whatever is left in the existing map needs to be removed
    toRemove.push(...existingCropMap.values());

    // Perform updates, creations, and removals
    const updatePromises = [];
    toUpdate.forEach((detail) => {
      updatePromises.push(
        purchasingdetail.update(
          {
            PricePerUnit: detail.Price,
            CropType: detail.CropType,
            QualityTypeID: detail.QualityTypeID,
          },
          { where: { PurchasingDetailID: detail.PurchasingDetailID } }
        )
      );
    });

    const createPromise = purchasingdetail.bulkCreate(toCreate);
    const removePromises = [];
    toRemove.forEach((detail) => {
      removePromises.push(
        purchasingdetail.destroy({
          where: { PurchasingDetailID: detail.PurchasingDetailID },
        })
      );
    });

    await Promise.all([...updatePromises, createPromise, ...removePromises]);

    res
      .status(200)
      .json({ message: "Purchasing details updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUserInfo = async (req, res, next) => {
  try {
    newInfo = req.body.editedUserInfo;
    console.log("======================", newInfo);
    if (newInfo.userType) {
      await FarmerInfo.update(
        {
          Fullname: newInfo.fullname,
          RSBSA: newInfo.extraInfo,
          ProfileImg: newInfo.profileImg,
        },
        { where: { UserID: newInfo.userId } }
      );
    } else {
      await FarmerInfo.update(
        {
          Fullname: newInfo.fullname,
          TraderType: newInfo.extraInfo,
          ProfileImg: newInfo.profileImg,
        },
        { where: { UserID: newInfo.userId } }
      );
    }

    res
      .status(200)
      .json({ success: true, message: "User Info updated successfully" });
  } catch (err) {
    console.log(err);
  }
};
