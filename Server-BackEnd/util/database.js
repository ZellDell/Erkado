const Sequelize = require("sequelize");
const sequelize = new Sequelize("ErkadoDB", "root", "dell02282002", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
