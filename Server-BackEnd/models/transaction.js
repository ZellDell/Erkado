const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Transaction = sequelize.define(
  "transaction",
  {
    TransactionID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    FarmerUserID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    TraderUserID: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    TotalNumOfCrops: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    Total: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    TimeStamp: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    Status: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "transaction",
    timestamps: false,
  }
);

const TransactionContent = sequelize.define(
  "transactioncontent",
  {
    TransactionContentID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    TransactionID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    CropID: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    PricePerUnit: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    CropType: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    QualityTypeID: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    Quantity: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    Total: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "transactioncontent",
    timestamps: false,
  }
);

const ViewAccess = sequelize.define(
  "viewaccess",
  {
    ViewAccessID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    TransactionID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Status: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    FarmerNotification: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    TraderNotification: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "viewaccess",
    timestamps: false,
  }
);

TransactionContent.belongsTo(Transaction, { foreignKey: "TransactionID" });
ViewAccess.belongsTo(Transaction, { foreignKey: "TransactionID" });
Transaction.hasMany(TransactionContent, {
  foreignKey: "TransactionID",
  as: "transactioncontent",
});
Transaction.hasMany(ViewAccess, {
  foreignKey: "TransactionID",
  as: "viewaccess",
});

module.exports = {
  Transaction,
  TransactionContent,
  ViewAccess,
};
