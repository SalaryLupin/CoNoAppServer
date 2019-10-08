const models = require("../../models")
const crypto = require("crypto")
const coder = require("../../util/coder")
const smsSender = require("../../util/sms-sender")
const tokener = require("../../util/tokener")
const newErr = require("../../middleware/error")

function validateUserId(userId){
  if (!userId) return false;
  const idRegExp = /^[0-9]{11}$/;
  return idRegExp.test(userId)
}

function validateUserPw(userPw){
  if (!userPw) return false;
  const pwRegExp = /^[a-zA-Z0-9!@]{8,20}$/;
  return pwRegExp.test(userPw)
}

function validateUser(userId, userPw){
  return validateUserId(userId) && validateUserPw(userPw)
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

  const userId = req.body.userId
  const userPw = req.body.userPw

  const authToken = ""
  const accessToken = ""
  if (!validateUser(userId, userPw)) {
    req.Error.wrongParameter(res, "userId or userPw")
    return
  }

  const check = (user) => {
        if(!user) {
            throw new newErr.UserNotExistError(userId)
        } else {

          const salt = user.salt
          const hashPw = crypto.createHash("sha512").update(userPw + salt).digest("hex");
          const dbPw = user.userPw

          if (hashPw == dbPw){
            if (user.isAuthorized){
              return user
            }
            else {
              throw new newErr.SMSAuthorizeError("need authorization")
            }
          }
          else {
            throw new newErr.UserNotExistError(userId)
          }
        }
    }

    const issueAuthTokens = (user) => {
      const token = tokener.signAuthToken(user.userId)
      if (token) {
        authToken = token
        return user
      }
      else {
        throw new newErr.TokenCreationError("Can't Make Token")
      }
    }

    const issueAccessTokens = (user) => {
      const token = tokener.signAccessToken(user.userId)
      if (token) {
        accessToken = token
        return user
      }
      else {
        throw new newErr.TokenCreationError("Can't Make Token")
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
        console.log(err)
        const name = err.name
        if (name == "UserNotExistError") { req.Error.wrongParameter(res) }
        else if (name == "SMSAuthorizeError"){ req.Error.noAuthorization(res) }
        else { req.Error.internal(res) }
      })

}

exports.logout = (req, res) => {

  const userId = req.AppUser.userId

  models.User
    .update(
      { authToken: null },
      { where: { userId: userId }}
    )
    .then(result => {
      res.json({ userId: result.userId })
    })
    .catch(err=>{
      console.log(err)
      req.Error.internal(res)
    })

}

exports.register = (req, res) => {

  const userId = req.body.userId
  const userPw = req.body.userPw
  const songTags = req.body.songTags ? req.body.songTags : []

  const salt = Math.round((new Date().valueOf() * Math.random())) + "";
  const hashPassword = crypto.createHash("sha512").update(userPw + salt).digest("hex");

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
      res.json({ userId: result.userId })
    })
    .catch(err => {
      const name = err.name

      if (name == "SequelizeUniqueConstraintError"){ req.Error.duplicatedUser(res) }
      else { console.log(err); req.Error.internal(res) }
    })

}

exports.getAuthMsg = (req, res) => {

  const userId = req.body.userId

  if (!userId || !validateUserId(userId)){
    req.Error.wrongParameter(res)
    return
  }

  const checkUser = (user) => {
    if (user){
      if (!user.isAuthorized){ return user }
      else { throw new newErr.AlreadySMSAuthorizeError("Already Authrized") }
    }
    else { throw new newErr.UserNotExistError(userId) }
  }

  const makeRandomNumber = (user) => {
    const randomNumber = makeRandomString("0123456789", 6)
    return { user: user, randomNumber: randomNumber }
  }

  const sendSMS  = (data) => {
    return new Promise((resolve, reject) =>{
      const targets = [data.user.userId]
      const body = "인증번호는 [" + data.randomNumber + "] 입니다."
      smsSender.sendSMS(targets, body, (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        else {
          resolve(data)
        }
      })
    });
  }

  const makeToken = (data) => {
    const token = tokener.signReqToken(data.user.userId, data.randomNumber)
    if (token) {
      return token
    }
    else {
      throw new newErr.TokenCreationError("Can't Make Token")
    }
  }

  const respond = (token) => {
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
    .then(sendSMS)
    .then(makeToken)
    .then(respond)
    .catch((err) => {
      console.log(err)
      const name = err.name
      if (name == "UserNotExistError") {
        req.Error.wrongParameter(res)
      }
      else if (name == "AlreadySMSAuthorizeError"){
        req.Error.noAuthorization(res)
      }
      else {
        req.Error.internal(res)
      }
    })

}

exports.postAuthMsg = (req, res) => {

  var token = coder.decrypt(req.body.token)
  const number = req.body.number + ""
  const userId = req.body.userId

  if (!token || !number || !userId || !validateUserId(userId)){
    req.Error.wrongParameter(res)
    return
  }

  const decoded = tokener.verifyToken(token)
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

  const auth = coder.decrypt(req.body.auth)
  const userId = req.body.userId

  if (!auth || !userId) {
    req.Error.wrongParameter(res)
    return
  }

  auth = tokener.verify(auth)
  if (!auth) {
    req.Error.tokenExpired(res)
    return
  }
  models.User
    .findOne(
      { where: { userId: userId, authToken: auth }}
    ).then(user => {
      if (user) {
        var access = tokener.signAccessToken(auth.userId)
        access = coder.encrypt(access)
        res.json({ access: access })
      }
      else {
        res.Error.noAuthorization(res)
      }
    })
    .catch(err => {
      console.log(err)
      req.Error.internal(res)
    })
}
