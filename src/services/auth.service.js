const User = require("../models/user.model");

const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../errors/index");
const { generateToken } = require("../utils/jwt");
const login = async (userData) => {
  const { email, password } = userData;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new BadRequestError("Invalid password");
  }
  const token = generateToken(user);
  return { token };
};
const register = async (userData) => {
  const { email, password } = userData;
  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    throw new BadRequestError("Email already in use");
  }
  if (password.length < 6) {
    throw new BadRequestError("Password must be at least 6 characters long");
  }
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const user = new User(userData);
  await user.save();
  const token = generateToken(user);
  return { token };
};
const getInformation = async (userId) => {
  const user = await User.findById(userId, "-password -role");
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

module.exports = {
  login,
  register,
  getInformation,
};
