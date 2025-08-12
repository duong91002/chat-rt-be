const RoomService = require("../services/room.service");
const { viewOne, viewAll } = require("../utils/view");
const createRoom = async (req, res) => {
  try {
    const room = await RoomService.createRoom(req.body, req.user.id);
    return viewOne(res, room);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getUserRooms = async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;
  try {
    const rooms = await RoomService.getUserRooms(
      parseInt(page),
      parseInt(perPage),
      req.user.id
    );
    return viewAll(res, rooms);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRoomById = async (req, res) => {
  const { receiverId } = req.query;
  try {
    const room = await RoomService.getRoomById(null, receiverId, req.user.id);
    return viewOne(res, room);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createRoom,
  getUserRooms,
  getRoomById,
};
