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

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);
app.use("/auth", authRoutes);
app.use("/chats", chatRoutes);

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
