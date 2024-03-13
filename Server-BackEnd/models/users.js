const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define(
  "users",
  {
    UserID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    Username: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    Email: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    Password: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    UserType: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;
