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
const { all } = require("../routes/traders.js");

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
      console.log(traderResults);
      res.status(200).json(traderResults);
    } else {
      return res.status(404).json({ message: "No results found" });
    }
  } catch (error) {
    console.error("Error querying traders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTradersInRadius = async (req, res, next) => {
  try {
    const userLat = parseFloat(req.query.userLat);
    const userLong = parseFloat(req.query.userLong);
    const radius = parseFloat(req.query.Radius); // in km
    console.log(userLat, userLong, radius);
    // Fetch all traders along with their coordinates
    const allTraders = await TraderInfo.findAll();

    // Filter traders within the specified radius
    const tradersInRadius = allTraders.filter((trader) => {
      const coordinates = trader.Address.split("|")[1];
      const traderLat = parseFloat(coordinates.split(",")[0]);
      const traderLong = parseFloat(coordinates.split(",")[1]);
      const distance = calculateDistance(
        userLat,
        userLong,
        traderLat,
        traderLong
      );
      trader.dataValues.distance = distance;
      return distance <= radius;
    });

    if (tradersInRadius.length !== 0) {
      for (const trader of tradersInRadius) {
        const traderPurchasingDetails = await purchasingdetail.findAll({
          where: {
            TraderID: trader.TraderID,
          },
        });
        trader.dataValues.purchasingDetails = traderPurchasingDetails;
      }
      res.status(200).json(tradersInRadius);
    } else {
      return res.status(404).json({ message: "No results found" });
    }
  } catch (error) {
    console.error("Error querying traders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

calculateDistance = (lat1, lon1, lat2, lon2) => {
  console.log(lat1, lon1, lat2, lon2);

  let dLat = ((lat2 - lat1) * Math.PI) / 180.0;
  let dLon = ((lon2 - lon1) * Math.PI) / 180.0;

  // convert to radiansa
  lat1 = (lat1 * Math.PI) / 180.0;
  lat2 = (lat2 * Math.PI) / 180.0;

  // apply formulae
  let a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  let rad = 6371;
  let c = 2 * Math.asin(Math.sqrt(a));
  distance = rad * c;
  return distance.toFixed(2);
};
