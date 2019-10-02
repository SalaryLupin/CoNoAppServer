const models = require("../../models")
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const coder = require("../../util/coder")

function validateUser(userId, userPw){

  if (!userId || !userPw) return false;

  // id 는 핸드폰 번호만 가능
  const idRegExp = /^[0-9]{11}$/;
  // pw는 특수문자 포함 8글자 이상 20글자 이하
  const pwRegExp = /^[a-zA-Z0-9!@]{8,20}$/;
  return idRegExp.test(userId) && pwRegExp.test(userPw)

}

function makeRandomString() {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 20;
  var randomstring = '';
  for (var i=0; i<string_length; i++) {
  var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  return randomstring;
}

exports.login = (req, res) => {

  let userId = req.body.userId
  let userPw = req.body.userPw
  let secret = req.app.get("jwt-secret")

  let authToken = ""
  let accessToken = ""
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

          let salt = user.salt
          let hashPw = crypto.createHash("sha512").update(userPw + salt).digest("hex");
          let dbPw = user.userPw

          if (hashPw == dbPw){
            return user
          }
          else {
            throw new Error('login failed')
          }

        }
    }
    const issueAuthTokens = (user) => {
      return new Promise((resolve, reject) => {
          jwt.sign(
            {
                type: "auth",
                userId: user.userId,
            },
            secret,
            {
                expiresIn: '30d',
                issuer: 'conoapp',
                subject: 'userInfo'
            }, (err, token) => {
              if (err) { reject(err); }
              authToken = token
              resolve(user)
            });
      });
    }

    const issueAccessTokens = (user) => {
      return new Promise((resolve, reject) => {
          jwt.sign(
            {
                userId: user.userId,
                type: "access"
            },
            secret,
            {
                expiresIn: '1h',
                issuer: 'conoapp',
                subject: 'userInfo'
            }, (err, token) => {
              if (err) { reject(err); }
              accessToken = token
              resolve(user)
            });
      });
    }

    const saveToken = (user) => {
      return new Promise((resolve, reject) => {
        console.log("auth:" + authToken)
        console.log("access:" + accessToken)
        models.User
          .update(
            { authToken: authToken },
            { where: { userId: user.userId }}
          )
          .then(resolve(user))
          .catch(err => reject(err))
      });
    }

    // respond the token
    const respond = (user) => {
      var data = {
        dummy: makeRandomString(),
        auth: coder.encrypt(authToken),
        access: coder.encrypt(accessToken),
      }
      data = JSON.stringify(data)
      console.log(data)
      data = coder.encrypt(data)

        res.json({
            message: 'logged in successfully',
            data: data
        })
    }

    models.User
      .findOne({
        where: { userId: userId }
      })
      .then(check)
      .then(issueAuthTokens)
      .then(issueAccessTokens)
      .then(saveToken)
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

  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash("sha512").update(userPw + salt).digest("hex");

  if (!validateUser(userId, userPw)) {
    req.Error.wrongParameter(res, "userId or userPw")
    return
  }

  models.User
    .create({
      userId: userId,
      userPw: hashPassword,
      salt: salt,
    })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      console.log(err)
      req.Error.wrongParameter(res, "userId or userPw")
    })

}
