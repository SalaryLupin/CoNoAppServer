const express = require("express")
const router = express.Router()
const appUser = require("../../middleware/appuser")

const fc = require("./friend.controller.js");

router.post("/", [appUser.checkLogin, fc.addFriends])
router.delete("/", [appUser.checkLogin, fc.deleteFriends])

module.exports = router
