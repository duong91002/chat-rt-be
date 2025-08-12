const chatController = require("../controllers/chat.controller");
const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, chatController.createChat);
router.get("/", protect, chatController.getChats);

module.exports = router;
