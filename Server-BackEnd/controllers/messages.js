const cloudinary = require("../cloud/cloudinary.js");
const User = require("../models/users.js");
const Message = require("../models/messages.js");
const {
  FarmerInfo,
  TraderInfo,
  purchasingdetail,
  cropdetail,
} = require("../models/userInfo.js");

bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const jwt = require("jsonwebtoken");

exports.getConversation = async (req, res, next) => {
  const userId = req.userId;
  const userType = req.query.userType;
  console.log("UserType", userType);
  try {
    const conversations = await Message.findAll({
      where: {
        [Op.or]: [{ SenderID: userId }, { ReceiverID: userId }],
      },
      order: [["TimeStamp", "ASC"]],
    });

    const uniqueConversations = [];

    conversations.forEach((convo) => {
      const otherUserId =
        convo.SenderID == userId ? convo.ReceiverID : convo.SenderID;

      if (!uniqueConversations[otherUserId]) {
        uniqueConversations[otherUserId] = convo;
      } else {
        uniqueConversations[otherUserId] = convo;
      }
    });

    const uniqueConversationsArray = Object.values(uniqueConversations);

    if (uniqueConversationsArray.length === 0) {
      return res.status(200).json({ message: "No conversations found" });
    }

    for (const convo of uniqueConversationsArray) {
      const otherUserId =
        convo.SenderID == userId ? convo.ReceiverID : convo.SenderID;

      const isLastSender = convo.SenderID == userId;

      let Info;
      if (userType === "Trader") {
        Info = await FarmerInfo.findAll({
          where: {
            UserID: otherUserId,
          },
        });
      } else {
        Info = await TraderInfo.findAll({
          where: {
            UserID: otherUserId,
          },
        });
      }

      convo.dataValues.isLastSender = isLastSender;
      convo.dataValues.Info = Info;
    }
    console.log("Conversations :", uniqueConversationsArray);
    return res.status(200).json(uniqueConversationsArray);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

exports.sendMessage = async (SenderID, ReceiverID, Msg, io) => {
  console.log(SenderID, ReceiverID, Message);
  try {
    // Save the new message to the database
    const newMessage = await Message.create({
      SenderID: SenderID,
      ReceiverID: ReceiverID,
      Message: Msg,
      TimeStamp: new Date().toISOString(),
    });

    const senderRoom = io.sockets.adapter.rooms.get(SenderID);
    if (senderRoom) {
      io.to(SenderID).emit("Messages", newMessage);
      console.log("Emiting Sender");
    }
    const receiverRoom = io.sockets.adapter.rooms.get(ReceiverID);
    if (receiverRoom) {
      io.to(ReceiverID).emit("Messages", newMessage);
      console.log("Emiting Receiver");
    }

    return { newMessage };
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

exports.getConversationWithOther = async (userID, otherID, io) => {
  try {
    const conversations = await Message.findAll({
      where: {
        [Op.or]: [
          { SenderID: userID, ReceiverID: otherID },
          { SenderID: otherID, ReceiverID: userID },
        ],
      },
      order: [["TimeStamp", "DESC"]],
    });

    console.log("Conversations :", conversations);
    io.to(userID).emit("Messages", conversations);

    return { conversations };
  } catch (error) {
    console.error("Error fetching convo:", error);
  }
};
