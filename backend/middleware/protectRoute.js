const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.document_editor_token;
    if (!token) {
      throw Error("Unauthorized: Ypu need to login first");
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      throw Error("Unauthorized: Invalid token");
    }

    const userId = decoded.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

module.exports = protectRoute;
