const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const crops = sequelize.define(
  "crops",
  {
    CropID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    CropName: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    Description: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    Image: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "crops",
    timestamps: false,
  }
);

const qualitytype = sequelize.define(
  "qualitytype",
  {
    QualityTypeID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    QualityType: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "qualitytype",
    timestamps: false,
  }
);

module.exports = { crops: crops, qualitytype: qualitytype };
