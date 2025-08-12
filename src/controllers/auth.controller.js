const authService = require("../services/auth.service");
const { viewOne, viewAll } = require("../utils/view");
const register = async (req, res) => {
  try {
    const token = await authService.register(req.body);
    return viewOne(res, token);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    return viewOne(res, token);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await authService.getInformation(req.user.id);
    return viewOne(res, user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
};
