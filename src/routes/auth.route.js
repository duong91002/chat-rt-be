const authController = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", protect, authController.getUserInfo);

module.exports = router;
