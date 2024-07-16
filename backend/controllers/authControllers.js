const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateTokenAndSetCookie = require("../lib/utils/generateTokenAndSetCookie");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username) {
      throw Error("Please provide username");
    } else if (!email) {
      throw Error("Please provide email");
    } else if (!password) {
      throw Error("Password field is required");
    }

    const isUsernameAlreadyTaken = await User.findOne({ username });
    if (isUsernameAlreadyTaken) {
      throw Error("Username is already taken");
    }

    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    if (!emailRegex.test(email)) {
      throw Error("Invalid email format");
    }

    const isEmailAlreadyTaken = await User.findOne({ email });
    if (isEmailAlreadyTaken) {
      throw Error("Email is already taken");
    }

    if (password.length < 6) {
      throw Error("Password must be at least 6 characters long");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const saveUser = await newUser.save();

      await generateTokenAndSetCookie(newUser._id, res);
      saveUser.password = null;

      res.json({
        message: "Signup successfull",
        data: saveUser,
        success: true,
        error: false,
      });
    } else {
      throw Error("User data is invalid");
    }
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      throw Error("Please provide username");
    } else if (!password) {
      throw Error("Password field is required");
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw Error("Invalid username");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password || ""
    );
    if (!isPasswordCorrect) {
      throw Error("Invalid password");
    }

    await generateTokenAndSetCookie(user._id, res);
    user.password = null;

    res.json({
      message: "Login successful",
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

const logout = async (req, res) => {
  try {
    res.cookie("document_editor_token", "");
    res.json({
      message: "Logout successful",
      data: null,
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

module.exports = { signup, login, logout };
