const UserService = require("../services/user.service");
const { viewAll, viewOne } = require("../utils/view");
const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    return viewOne(res, user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserService.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return viewOne(res, user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getUsers = async (req, res) => {
  const { page = 1, perPage = 10, name } = req.query;
  try {
    const users = await UserService.getUsers(
      req.user.id,
      parseInt(page),
      parseInt(perPage),
      name
    );
    return viewAll(res, users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getAllUsers = async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;
  try {
    const users = await UserService.getAllUsers(
      parseInt(page),
      parseInt(perPage)
    );
    return viewAll(res, users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return viewOne(res, user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await UserService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUsers,
};
