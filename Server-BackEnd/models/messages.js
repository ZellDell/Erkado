const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Message = sequelize.define(
  "message",
  {
    MessageID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    SenderID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    ReceiverID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Message: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    TimeStamp: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "message",
    timestamps: false,
  }
);

module.exports = Message;
