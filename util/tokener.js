
const jwt = require('jsonwebtoken')
const config = require("../config/token")

const secret = config.jwtSecret

function signToken(data, expiresIn){
  try {
    const signedToken = jwt.sign(
      data,
    secret,
    {
        expiresIn: expiresIn,
        issuer: 'conoapp',
        subject: 'userInfo'
    })
    return signedToken;
  } catch(e){
    console.log(e)
  }
  return null
}

module.exports = {

  signAuthToken: (userId) => {
    return signToken({ type: "auth", userId: userId }, "30d")
  },

  signAccessToken: (userId) => {
    return signToken({ type: "access", userId: userId }, userId, "1h")
  },

  signReqToken: (userId, number) => {
    return signToken({ type: "req", userId: userId, req: number }, "3m")
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, secret)
    }
    catch (e){
      return null
    }
  }


}
