const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.DBROOT,
  process.env.DBPASSWORD,
  {
    dialect: "mysql",
    host: process.env.DBHOST,
  }
)
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
