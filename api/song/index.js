const express = require("express")
const router = express.Router()

const songController = require("./song.controller.js");
const tagController = require("./tag.controller.js");

router.get("/search", songController.search)

router.get("/tag", tagController.tags)
router.get("/category", tagController.categories)

module.exports = router
