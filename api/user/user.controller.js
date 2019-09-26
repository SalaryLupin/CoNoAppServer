const models = require("../../models")
const jwt = require('jsonwebtoken')

function validateUser(userId, userPw){
  return true
}

exports.login = (req, res) => {

  let userId = req.body.userId
  let userPw = req.body.userPw
  let secret = req.app.get("jwt-secret")
  console.log(secret)
  if (!validateUser(userId, userPw)) {
    req.Error.wrongParameter(res, "userId or userPw")
  }

  const check = (user) => {
        if(!user) {
            // user does not exist
            throw new Error('login failed')
        } else {

          const p = new Promise((resolve, reject) => {
              jwt.sign(
                  {
                      userId: user.userId
                  },
                  secret,
                  {
                      expiresIn: '7d',
                      issuer: 'conoapp',
                      subject: 'userInfo'
                  }, (err, token) => {
                      if (err) reject(err)
                      resolve(token)
                  })
          })
          return p

        }
    }

    // respond the token
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        })
    }

    models.User
      .findOne({
        where: { userId: userId, userPw: userPw}
      })
      .then(check)
      .then(respond)
      .catch(err =>{
        req.Error.internal(res)
        console.log(err)
      })

}

exports.register = (req, res) => {

  let userId = req.body.userId
  let userPw = req.body.userPw
  let songTags = req.body.songTags ? req.body.songTags : []

  if (!validateUser(userId, userPw)) {
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
