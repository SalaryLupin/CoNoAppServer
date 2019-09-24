const express = require("express")
const router = express.Router()
const playlistController = require("./playlist.controller")

router.get("/", playlistController.index);
router.get("/:playlistId", playlistController.show);

module.exports = router
