const { crops, qualitytype } = require("../models/crops.js");

exports.getCrops = async (req, res, next) => {
  const Crops = await crops.findAll();
  const Quality = await qualitytype.findAll();

  return res.status(201).json({
    Crops,
    Quality,
  });
};
