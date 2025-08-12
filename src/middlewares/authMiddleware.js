const { verifyToken } = require("../utils/jwt.js");

const { UnauthorizedError, ForbiddenError } = require("../errors/index.js");
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    throw new ForbiddenError("Invalid or expired token");
  }

  req.user = decoded;
  next();
};
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
module.exports = {
  protect,
  isAdmin,
};
