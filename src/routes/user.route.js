const express = require("express");

const UserController = require("../controllers/user.controller");
const router = express.Router();
const { protect, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", protect, isAdmin, UserController.createUser);
router.get("/:id", protect, UserController.getUserById);
router.get("/", protect, UserController.getUsers);
router.put("/:id", protect, isAdmin, UserController.updateUser);
router.delete("/:id", protect, isAdmin, UserController.deleteUser);
router.get("/getAll", protect, isAdmin, UserController.getAllUsers);
module.exports = router;
