const User = require("../models/userModel");

const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw Error("User not found");
    }

    res.json({
      message: "User fetched successfully",
      data: user,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

const updateUserDocs = async (req, res) => {
  try {
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

module.exports = { getUser, updateUserDocs };
