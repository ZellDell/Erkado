// server.js

const express = require("express");
const app = express();

const http = require("http").Server(app); // Import http module and create server instance
const io = require("socket.io")(http); // Import and initialize Socket.io with the server instance

const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const PORT = 3000;
const multer = require("multer");
const cors = require("cors");

const userRoutes = require("./routes/users");
const userInfoRoutes = require("./routes/userInfo");
const cropRoutes = require("./routes/crops");
const traderRoutes = require("./routes/traders");
const messageRoutes = require("./routes/messages");
const transactionRoutes = require("./routes/transaction");

const initializeSocket = require("./websocket/socket-io");

// Initialize Socket.io
initializeSocket(io);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({
    msg: "Server Connected",
  });
  console.log("Requesting..");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/user", userRoutes);
app.use("/userInfo", userInfoRoutes);
app.use("/crops", cropRoutes);
app.use("/traders", traderRoutes);
app.use("/messages", messageRoutes);
app.use("/transaction", transactionRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

sequelize
  .sync()
  .then((result) => {
    http.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
