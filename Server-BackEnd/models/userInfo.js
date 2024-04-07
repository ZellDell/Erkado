const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const FarmerInfo = sequelize.define(
  "farmerinfo",
  {
    FarmerID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    UserID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    RSBSA: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    Fullname: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    Address: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    ProfileImg: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "farmerinfo",
    timestamps: false,
  }
);

const TraderInfo = sequelize.define(
  "traderinfo",
  {
    TraderID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    UserID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    TraderType: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    Fullname: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    Address: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    ProfileImg: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "traderinfo",
    timestamps: false,
  }
);

const purchasingdetail = sequelize.define(
  "purchasingdetail",
  {
    PurchasingDetailID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    TraderID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    CropID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    PricePerUnit: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "purchasingdetail",
    timestamps: false,
  }
);

const cropdetail = sequelize.define(
  "cropdetail",
  {
    CropDetailID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    FarmerID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    CropID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "cropdetail",
    timestamps: false,
  }
);

module.exports = {
  FarmerInfo: FarmerInfo,
  TraderInfo: TraderInfo,
  purchasingdetail: purchasingdetail,
  cropdetail: cropdetail,
};
