const models = require("../../models")
const jwt = require('jsonwebtoken')

function validateUser(userId, userPw){

  if (!userId || !userPw) return false;

  // id 는 핸드폰 번호만 가능
  const idRegExp = /^[0-9]{11}$/;
  // pw는 특수문자 포함 8글자 이상 20글자 이하
  const pwRegExp = /^[a-zA-Z0-9!@]{8,20}$/;
  return idRegExp.test(userId) && pwRegExp.test(userPw)

}

exports.login = (req, res) => {

  let userId = req.body.userId
  let userPw = req.body.userPw
  let secret = req.app.get("jwt-secret")
  console.log(secret)
  if (!validateUser(userId, userPw)) {
    req.Error.wrongParameter(res, "userId or userPw")
    return
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
    return
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
