const express = require("express")
const router = express.Router()
const coder = require("../util/coder")

router.post("/decode", (req, res) => {
  res.json({ result: coder.decrypt(req.body.string) })
})

router.post("/encode", (req,res) => {
  res.json({ result: coder.encrypt(req.body.string) })
})

module.exports = router
