const User = require("../models/user.model");
const { NotFoundError, InternalServerError } = require("../errors/index");
const findUserById = async (id) => {
  try {
    return await User.findById(id, "-password -role");
  } catch (error) {
    throw new NotFoundError("User not found");
  }
};

const createUser = async (userData) => {
  const user = new User(userData);
  try {
    return await user.save();
  } catch (error) {
    throw new InternalServerError("Error creating user");
  }
};
const getAllUsers = async (page = 1, perPage = 10) => {
  const filter = {};
  const totalEntries = await User.countDocuments(filter);
  const users = await User.find(filter, "-password -role")
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();
  const totalPages = Math.ceil(totalEntries / perPage);
  return { data: users, totalEntries, totalPages, currentPage: page };
};
const getUsers = async (userId, page = 1, perPage = 10, name = "") => {
  const filter = {
    ...(userId && { _id: { $ne: userId } }),
    ...(name && { name: { $regex: name, $options: "i" } }),
  };

  const [totalEntries, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter, "-password -role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage),
  ]);

  return {
    data: users,
    totalEntries,
    totalPages: Math.ceil(totalEntries / perPage),
    currentPage: page,
  };
};

const updateUser = async (id, userData) => {
  try {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  } catch (error) {
    throw new InternalServerError("Error updating user");
  }
};
const deleteUser = async (id) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw new InternalServerError("Error deleting user");
  }
};
module.exports = {
  findUserById,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUsers,
};
