const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { verifyToken } = require("../src/utils/jwt");
const http = require("http");

const userRoutes = require("./routes/user.route");
const roomRoutes = require("./routes/room.route");
const authRoutes = require("./routes/auth.route");
const chatRoutes = require("./routes/chat.route");
const initSocket = require("./socket/index");
dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());
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
