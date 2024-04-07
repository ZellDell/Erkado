const cloudinary = require("../cloud/cloudinary.js");
const User = require("../models/users.js");
const { crops, croptype, qualitytype } = require("../models/crops.js");
const {
  FarmerInfo,
  TraderInfo,
  purchasingdetail,
  cropdetail,
} = require("../models/userInfo.js");

bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const jwt = require("jsonwebtoken");

exports.queryTraders = async (req, res, next) => {
  try {
    const inputText = req.query.inputText;
    const queryType = req.query.queryType;

    let traderResults = [];
    let cropResults = [];

    // Find traders matching the input text in Fullname or TraderType
    if (queryType === "trader") {
      traderResults = await TraderInfo.findAll({
        where: {
          [Op.or]: [
            { Fullname: { [Op.like]: `%${inputText}%` } },
            { TraderType: { [Op.like]: `%${inputText}%` } },
          ],
        },
      });
    } else if (queryType === "crop") {
      // Find crops matching the input text in CropName
      cropResults = await crops.findAll({
        where: {
          CropName: { [Op.like]: `%${inputText}%` },
        },
      });

      if (cropResults.length > 0) {
        const cropIDs = cropResults.map((crop) => crop.CropID);

        // Find purchasing details matching the CropIDs
        const purchasingResults = await purchasingdetail.findAll({
          where: {
            CropID: { [Op.in]: cropIDs },
          },
        });

        const traderIDs = new Set(purchasingResults.map((p) => p.TraderID));

        // Find traders using the extracted TraderIDs
        traderResults = await TraderInfo.findAll({
          where: {
            TraderID: { [Op.in]: Array.from(traderIDs) },
          },
        });
      }
    }

    if (traderResults.length !== 0) {
      for (const trader of traderResults) {
        const traderPurchasingDetails = await purchasingdetail.findAll({
          where: {
            TraderID: trader.TraderID,
          },
        });
        trader.dataValues.purchasingDetails = traderPurchasingDetails;
      }
      res.status(200).json(traderResults);
    } else {
      return res.status(404).json({ message: "No results found" });
    }
  } catch (error) {
    console.error("Error querying traders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
