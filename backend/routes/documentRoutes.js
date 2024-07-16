const express = require("express");
const {
  getUserCreatedDocs,
  getUserEditedDocs,
  updateDoc,
  updateRoomDoc,
  createDoc,
} = require("../controllers/documentControllers");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

router.post("/create", protectRoute, createDoc);
router.get("/created", protectRoute, getUserCreatedDocs);
router.get("/edited", protectRoute, getUserEditedDocs);
router.put("/update", protectRoute, updateDoc);
router.put("/room-update", updateRoomDoc);

module.exports = router;
