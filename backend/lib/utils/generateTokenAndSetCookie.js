const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = async (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15d",
    });

    res.cookie("document_editor_token", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

module.exports = generateTokenAndSetCookie;
