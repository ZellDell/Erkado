const Sequelize = require("sequelize");
const sequelize = new Sequelize("ErkadoDB", "root", "dell02282002", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

// const Sequelize = require("sequelize");
// const sequelize = new Sequelize(
//   "u478133511_Erkado",
//   "u478133511_Erkado",
//   "Erkado2024",
//   {
//     dialect: "mysql",
//     host: "srv1158.hstgr.io",
//   }
// );

// module.exports = sequelize;

// const Sequelize = require("sequelize");
// const sequelize = new Sequelize("erkadodb", "remoteuser", "ERKADOAPP2024", {
//   dialect: "mysql",
//   host: "93.127.198.109",
//   port: "3306",
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//   });

// module.exports = sequelize;
