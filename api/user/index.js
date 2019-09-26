const express = require("express")
const router = express.Router()
const uc = require("./user.controller")

router.post("/login")
router.get("/logout")
router.post("/register", uc.register)

module.exports = router
