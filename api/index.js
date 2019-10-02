const express = require("express")
const router = express.Router()

router.use("/user", require("./user"))
router.use("/song", require("./song"))
router.use("/playlist", require("./playlist"))
router.use("/friend", require("./friend"))

module.exports = router
