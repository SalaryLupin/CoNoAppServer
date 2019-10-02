const express = require("express")
const router = express.Router()
const uc = require("./user.controller")

router.post("/login", uc.login)
router.get("/logout")
router.post("/register", uc.register)
router.post("/refresh")

router.get("/auth_msg", uc.getAuthMsg)
router.post("/auth_msg", uc.postAuthMsg)

module.exports = router
