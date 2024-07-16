const express = require("express");
const { getUser, updateUserDocs } = require("../controllers/userControllers");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

router.get("/me", protectRoute, getUser);
router.put("/update", updateUserDocs);

module.exports = router;
