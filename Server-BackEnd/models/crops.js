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
    CropTypeID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    QualityTypeID: {
      type: Sequelize.INTEGER,
      allowNull: false,
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

const croptype = sequelize.define(
  "croptype",
  {
    CropTypeID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    Type: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "croptype",
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

crops.belongsTo(croptype, { foreignKey: "CropTypeID", as: "Type" });
crops.belongsTo(qualitytype, {
  foreignKey: "QualityTypeID",
  as: "QualityType",
});

module.exports = { crops: crops, croptype: croptype, qualitytype: qualitytype };
