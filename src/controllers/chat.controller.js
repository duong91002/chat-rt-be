const chatService = require("../services/chat.service");
const { viewOne, viewAll } = require("../utils/view");
const createChat = async (req, res) => {
  try {
    const chat = await chatService.createChat(req.body);
    return viewOne(res, chat);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getChats = async (req, res) => {
  const { roomId, page = 1, perPage = 20 } = req.query;
  try {
    const chats = await chatService.getChats(
      roomId,
      parseInt(page),
      parseInt(perPage)
    );
    return viewAll(res, chats);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createChat, getChats };
