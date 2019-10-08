const express = require("express")
const router = express.Router()
const appUser = require("../../middleware/appuser")

const sc = require("./song.controller.js");

router.get("/search", sc.search)

router.post("/tag/:songId", [appUser.checkLogin, sc.addTag])
router.get("/tag/:songId", [appUser.checkLogin, sc.showTag])
router.get("/tag", [appUser.checkLogin, sc.indexTag])

module.exports = router
