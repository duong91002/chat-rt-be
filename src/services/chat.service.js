const Chat = require("../models/chat.model");

const { InternalServerError, NotFoundError } = require("../errors/index");
const mongoose = require("mongoose");

const createChat = async (chatData) => {
  try {
    const chat = new Chat(chatData);
    return await chat.save();
  } catch (error) {
    throw new NotFoundError("Error creating chat: " + error.message);
  }
};
const getChats = async (roomId, page = 1, perPage = 20) => {
  const filter = { roomId: new mongoose.Types.ObjectId(roomId) };
  const [totalEntries, chats] = await Promise.all([
    Chat.countDocuments(filter),
    Chat.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean(),
  ]);

  return {
    data: chats.reverse(),
    totalEntries,
    totalPages: Math.ceil(totalEntries / perPage),
    currentPage: page,
  };
};

module.exports = { createChat, getChats };
