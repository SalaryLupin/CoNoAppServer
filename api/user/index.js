const express = require("express")
const router = express.Router()
const uc = require("./user.controller")
const appUser = require("../../middleware/appuser");

router.post("/login", uc.login)
router.get("/logout", [appUser.checkLogin, uc.logout])
router.post("/register", uc.register)
router.post("/refresh", uc.refreshToken)

router.get("/auth_msg", uc.getAuthMsg)
router.post("/auth_msg", uc.postAuthMsg)

module.exports = router
