const { version } = require("mongoose");
const Document = require("../models/documentModel");
const User = require("../models/userModel");

const createDoc = async (req, res) => {
  try {
    const { code, title } = req.body;
    const userId = req.user._id;

    if (!code) {
      throw Error("Please write some code");
    }
    const user = await User.findById(userId);

    if (!user) {
      throw Error("User not found");
    }

    const newDoc = new Document({
      content: code || "",
      title: title || "",
      user: user._id,
      version: 1,
      versions: [{ content: code || "", version: 1 }],
    });

    if (newDoc) {
      const saveDoc = await newDoc.save();

      await User.findByIdAndUpdate(userId, { $push: { created: saveDoc._id } });

      res.json({
        message: "Document saved successfully",
        data: saveDoc,
        success: true,
        error: false,
      });
    } else {
      throw Error("Document is invalid");
    }
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

const getUserCreatedDocs = async (req, res) => {
  try {
    const userId = req.user._id;
    const docs = await Document.find({ user: userId }).sort({ createdAt: -1 });
    res.json({
      message: "Documents fetched successfully",
      data: docs,
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

const getUserEditedDocs = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const docs = await Document.find({ _id: { $in: user.edited } }).sort({
      createdAt: -1,
    });
    res.json({
      message: "Documents fetched successfully",
      data: docs,
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

const updateDoc = async (req, res) => {
  try {
    const { content, title, id: docId } = req.body;

    const userId = req.user._id;

    const doc = await Document.findById(docId);
    if (!doc) {
      throw Error("Document not found");
    }

    (doc.content = content || ""),
      (doc.title = title || ""),
      (doc.version = doc.version + 1),
      (doc.versions = [
        ...doc.versions,
        { content: content || "", version: doc.version },
      ]);

    await doc.save();

    res.json({
      message: "Document updated successfully",
      data: doc,
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

const updateRoomDoc = async (req, res) => {
  try {
    const { content, title, docId, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    const doc = await Document.findById(docId);
    if (!doc) {
      throw Error("Document not found");
    }

    (doc.content = content || ""),
      (doc.title = title || ""),
      (doc.version = doc.version + 1),
      (doc.versions = [
        ...doc.versions,
        { content: content || "", version: doc.version },
      ]);

    const saveDoc = await doc.save();

    if (!user.edited.includes(docId)) {
      user.edited = [...user.edited, docId];
      await user.save();
    }

    res.json({
      message: `${user.username} is saved the document.`,
      data: saveDoc,
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

module.exports = {
  getUserCreatedDocs,
  getUserEditedDocs,
  updateDoc,
  createDoc,
  updateRoomDoc,
};
