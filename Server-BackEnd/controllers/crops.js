const { crops, croptype, qualitytype } = require("../models/crops.js");

exports.getCrops = async (req, res, next) => {
  const Crops = await crops.findAll({
    include: [
      { model: croptype, as: "Type" },
      { model: qualitytype, as: "QualityType" },
    ],
  });

  return res.status(201).json({
    Crops,
  });
};
