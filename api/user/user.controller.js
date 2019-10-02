const models = require("../../models")
const crypto = require("crypto")
const coder = require("../../util/coder")
const snsSender = require("../../util/sns-sender")
const tokener = require("../../util/tokener")

function validateUser(userId, userPw){

  if (!userId || !userPw) return false;

  // id 는 핸드폰 번호만 가능
  const idRegExp = /^[0-9]{11}$/;
  // pw는 특수문자 포함 8글자 이상 20글자 이하
  const pwRegExp = /^[a-zA-Z0-9!@]{8,20}$/;
  return idRegExp.test(userId) && pwRegExp.test(userPw)

}

function makeRandomString(from, length) {
  var chars = from ? from : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = length ? length : 20;
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
            if (user.isAuthorized){
              return user
            }
            else {
              throw new Error("need authorization")
            }
          }
          else {
            throw new Error('login failed')
          }

        }
    }
    const issueAuthTokens = (user) => {
      let token = tokener.signAuthToken(user.userId)
      if (token) {
        authToken = token
        return user
      }
      else {
        throw new Error("Can't Make Token")
      }
    }

    const issueAccessTokens = (user) => {
      let token = tokener.signAccessToken(user.userId)
      if (token) {
        accessToken = token
        return user
      }
      else {
        throw new Error("Can't Make Token")
      }
    }

    const saveToken = (user) => {
      return new Promise((resolve, reject) => {
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

exports.getAuthMsg = (req, res) => {

  let userId = req.body.userId

  if (!userId){
    req.Error.wrongParameter(res)
    return
  }

  const checkUser = (user) => {
    if (user){
      if (!user.isAuthorized){ return user }
      else { throw "Already Authorized" }
    }
    else { throw "No User" }
  }

  const makeRandomNumber = (user) => {
    let randomNumber = makeRandomString("0123456789", 6)
    console.log("random number is " + randomNumber)
    return { user: user, randomNumber: randomNumber }
  }

  const sendSNS  = (data) => {
    return new Promise((resolve, reject) =>{
      let targets = [data.user.userId]
      let body = "인증번호는 [" + data.randomNumber + "] 입니다."
      console.log(targets + ", " + body)
      snsSender.sendSNS(targets, body, (err, result) => {
        if (err) {
          console.log("err")
          reject(err)
        }
        else {
          resolve(data)
        }
      })
    });
  }

  const makeToken = (data) => {
    let token = tokener.signReqToken(user.userId, data.randomNumber)
    if (token) {
      return token
    }
    else {
      throw new Error("Can't Make Token")
    }
  }

  const respond = (token) => {
    console.log("final data " + token)
    res.json({
      token: coder.encrypt(token)
    })
  }


  models.User
    .findOne({
      where: { userId: userId }
    })
    .then(checkUser)
    .then(makeRandomNumber)
    .then(sendSNS)
    .then(makeToken)
    .then(respond)
    .catch((err) => {
      console.log(err)
      req.Error.internal(res)
    })

}

exports.postAuthMsg = (req, res) => {

  var token = coder.decrypt(req.body.token)
  let number = req.body.number + ""
  let userId = req.body.name

  if (!token || !number || !userId){
    req.Error.wrongParameter(res)
    return
  }

  let decoded = tokener.verifyToken(token)
  if (decoded) {
    if (decoded.req == number && decoded.userId == userId){
      models.User
        .update(
          { isAuthorized: true },
          { where: { userId: userId } }
        )
        .then((result) =>{
          if (result[0] > 0){
            res.json({msg: "success"})
          }
          else {
            req.Error.wrongParameter(res)
          }
        })
        .catch((err) => {
          console.log(err)
          req.Error.internal(res)
        })

    }
    else { req.Error.wrongParameter(res) }
  }
  else {
    req.Error.tokenExpired(res)
  }

}

exports.refreshToken =  (req, res) => {

  let auth = coder.decrypt(req.body.auth)

  if (!auth) {
    req.Error.wrongParameter(res)
    return
  }

  auth = tokener.verify(auth)
  if (auth) {
    var access = tokener.signAccessToken(auth.userId)
    access = coder.encrypt(access)
    res.json({ access: access })
  }
  else {
    req.Error.tokenExpired(res)
  }
}
