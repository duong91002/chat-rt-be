const express = require("express");
const RoomController = require("../controllers/room.controller");
const router = express.Router();
const { protect, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", protect, RoomController.createRoom);
router.get("", protect, RoomController.getUserRooms);
router.get("/get", protect, RoomController.getRoomById);

module.exports = router;
