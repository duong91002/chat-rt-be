const Room = require("../models/room.model");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../errors/index");
const mongoose = require("mongoose");

const User = require("../models/user.model");
const chatModel = require("../models/chat.model");
const getRoomById = async (roomId, receiverId = null, userId) => {
  let room = {};
  if (roomId && !userId) {
    room = await Room.findById(roomId).populate("users", "-password -role");
  } else {
    console.log("userId1: ", userId);
    console.log("receiverId1: ", receiverId);
    room = await Room.findOne({
      users: {
        $all: [
          new mongoose.Types.ObjectId(receiverId),
          new mongoose.Types.ObjectId(userId),
        ],
      },
    }).populate("users", "-password -role");
  }
  console.log("check: ", room);
  if (receiverId) {
    return filterUserInRoom(room.toObject(), receiverId);
  }
  return room;
};

const createRoom = async (roomData, userId) => {
  const { users, isGroup } = roomData;

  const room = new Room(roomData);
  try {
    if (!users || users.length < 2) {
      throw new BadRequestError(
        "At least two users are required to create a room"
      );
    }
    const userData = await User.find({
      _id: { $in: users },
    });

    if (userData.length !== users.length) {
      throw new NotFoundError("One or more users not found");
    }

    if (userData.length === 2 && !isGroup) {
      const existingRoom = await Room.findOne({
        users: { $all: users },
        isGroup: false,
      }).populate("users", "-password -role");
      if (existingRoom) {
        return filterUserInRoom(existingRoom.toObject(), userId);
      }
    }

    const savedRoom = await room.save();
    const saveWithUsers = await savedRoom.populate("users", "-password -role");

    return filterUserInRoom(saveWithUsers.toObject(), userId);
  } catch (error) {
    throw new InternalServerError("Error creating room");
  }
};
const filterUserInRoom = (room, receiverId) => {
  const participants = room.users.filter(
    (u) => u._id.toString() !== receiverId.toString()
  );

  return {
    ...room,
    users: participants,
  };
};

const getUserRooms = async (page = 1, perPage = 10, userId) => {
  const filter = {
    users: new mongoose.Types.ObjectId(userId),
  };

  const totalEntries = await Room.countDocuments(filter);

  const rooms = await Room.find(filter)
    .populate("users", "-password -role")
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();

  const filteredRooms = await Promise.all(
    rooms.map(async (room) => {
      const participants = room.users.filter(
        (u) => u._id.toString() !== userId.toString()
      );

      const lastMessage = await chatModel
        .findOne({ roomId: room._id })
        .populate("senderId", "-password -role")
        .sort({ createdAt: -1 })
        .select("-roomId")
        .lean();

      return {
        ...room,
        users: participants,
        lastMessage,
      };
    })
  );

  const totalPages = Math.ceil(totalEntries / perPage);

  return {
    data: filteredRooms,
    totalEntries,
    totalPages,
    currentPage: page,
  };
};

module.exports = {
  createRoom,
  getUserRooms,
  getRoomById,
};
