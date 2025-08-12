const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { verifyToken } = require("./src/utils/jwt");
const http = require("http");

const userRoutes = require("./src/routes/user.route");
const roomRoutes = require("./src/routes/room.route");
const authRoutes = require("./src/routes/auth.route");
const chatRoutes = require("./src/routes/chat.route");
const initSocket = require("./src/socket/index");
dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();

app.use(
  cors({
    origin: "https://chat-rt-fe.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
