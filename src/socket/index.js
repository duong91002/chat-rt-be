const { Server } = require("socket.io");
const { verifyToken } = require("../utils/jwt");
const { getUserRooms, getRoomById } = require("../services/room.service");
const chatService = require("../services/chat.service");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  const onlineUsers = new Map();

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const user = verifyToken(token, process.env.JWT_SECRET);
      socket.user = user;
      onlineUsers.set(user.id, socket.id);
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user?.id || socket.id);

    socket.on("join_all_rooms", async () => {
      const { data } = await getUserRooms(socket.user?.id);
      data.forEach((roomId) => socket.join(roomId.toString()));
    });

    socket.on("join_room", ({ roomId, receiverId }) => {
      socket.join(roomId);
      const receiverSocketId = onlineUsers.get(receiverId);
      const receiverSocket = io.sockets.sockets.get(receiverSocketId);
      if (receiverSocket) receiverSocket.join(roomId);
    });

    socket.on("typing", ({ roomId, senderName, isTyping }) => {
      socket.to(roomId).emit("receive_typing", { senderName, isTyping });
    });

    socket.on(
      "send_message",
      async ({ roomId, message, typeChat, receiverId, isNewRoom }) => {
        const senderId = socket.user.id;
        const msg = { senderId, message, roomId, typeChat, receiverId };

        let room = null;
        if (isNewRoom) {
          room = await getRoomById(msg.roomId, receiverId);
        }

        const savedChat = await chatService.createChat(msg);

        if (isNewRoom) {
          socket.to(roomId).emit("new_chat_user", { room, message: msg });
        } else {
          io.to(savedChat.roomId.toString()).emit("receive_message", savedChat);
        }
      }
    );

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.user?.id);
      console.log("User disconnected:", socket.user?.id || socket.id);
    });
  });
};
