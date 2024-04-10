const msgController = require("../controllers/messages");

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("JoinRoom", async ({ userID, otherID }) => {
      socket.join(userID);
      console.log("User joined room", userID, otherID);

      msgController.getConversationWithOther(userID, otherID, io);
    });

    socket.on("SendMessage", async ({ SenderID, ReceiverID, Msg }) => {
      const result = msgController.sendMessage(SenderID, ReceiverID, Msg, io);
    });

    socket.on("LeaveRoom", (userID) => {
      socket.leave(userID);
      console.log("User leaved the room", userID);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
