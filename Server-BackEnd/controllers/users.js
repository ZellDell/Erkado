const User = require("../models/users.js");
const { FarmerInfo, TraderInfo } = require("../models/userInfo.js");

bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const jwt = require("jsonwebtoken");

exports.userRegister = (req, res, next) => {
  console.log(req.body);
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const userType = req.body.userType;

  User.findOne({
    where: { Username: username },
  }).then((user) => {
    if (user) {
      res.status(401).json({ message: "Username is already used" });
    } else {
      User.findOne({
        where: { Email: email },
      })
        .then((user) => {
          if (user) {
            console.log("Email is already used");
            res.status(401).json({ message: "Email is already used" });
          } else {
            bcrypt
              .hash(password, 12)
              .then((hashedPw) => {
                User.create({
                  Username: username,
                  Email: email,
                  Password: hashedPw,
                  UserType: userType,
                }).then((result) => {
                  res.status(201).json({ message: "User created", result });
                });
              })
              .catch((err) => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                  console.log("bcrypt error");
                }
                next(err);
              });
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          res.status(500).json({ message: "Internal server error" });
        });
    }
  });
};

exports.userLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ where: { Username: username } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Username you've entered isn't connected to an Account",
        });
      }

      bcrypt.compare(password, user.Password).then((isEqual) => {
        if (!isEqual) {
          return res.status(401).json({
            message: "Invalid password",
          });
        }

        const token = jwt.sign(
          {
            username: user.Username,
            userId: user.UserID.toString(),
          },
          "ErkadoUserToken",
          { expiresIn: "1h" }
        );

        console.log(token);
        res.status(201).json({
          token: token,
          userId: user.UserID.toString(),
          UserType: user.UserType,
        });
      });
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(500).json({ message: "Internal server error" });
    });
};
