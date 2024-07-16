const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    created: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        default: [],
      },
    ],
    edited: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
