// const Sequelize = require("sequelize");
// const sequelize = new Sequelize("ErkadoDB", "root", "", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "u478133511_Erkado",
  "u478133511_Erkado",
  "Erkado2024",
  {
    dialect: "mysql",
    host: "srv1158.hstgr.io",
  }
);

module.exports = sequelize;
