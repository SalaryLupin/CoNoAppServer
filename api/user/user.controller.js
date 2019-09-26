const models = require("../../models")

function validateUser(userId, userPw){
  return true
}

exports.register = (req, res) => {

  let userId = req.body.userId
  let userPw = req.body.userPw
  let songTags = req.body.songTags ? req.body.songTags : []

  if (!validateUser(req, res)) {
    req.Error.wrongParameter(res, "userId or userPw")
  }

  models.User
    .create({
      userId: userId,
      userPw: userPw
    })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      console.log(err)
      req.Error.wrongParameter(res, "userId or userPw")
    })

}
