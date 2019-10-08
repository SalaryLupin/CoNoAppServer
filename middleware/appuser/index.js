/*
미들웨어 이름 : App user
커스텀 헤더 정보를 통해 앱 유저의 정보를 보기 쉽게 만든다.
   - 토큰 정보를 통해 계정 관리하기
   - iOS 유저인지 Android 유저인지 확인하기
   - 앱 버전 관리하기
*/

const express = require("express");
const router = express.Router();
const coder = require("../../util/coder")
const tokener = require("../../util/tokener")
const CustomError = require("../error")

function parseToken(token){

  if (!token) return [ null, new CustomError.NoAuthorizationError("no-token")];
  token = coder.decrypt(token)

  try {
    let decoded = tokener.verifyToken(token)
    console.log(decoded.userId + ", " + decoded.exp)
    return [ decoded.userId, null ]
  }
  catch(err){
    return [ null, err ]
  }
}

module.exports = {
  module: router,
  checkLogin: function(req, res, next){

    // 데이터 파싱
    let ver = req.header("Ver");
    let os = req.header("Os");
    let token = req.header("Token");
    let [ user, err ] = parseToken(token)
    console.log(user + ", " + err)

    // 에러 처리
    if (err){
      if (err.name == "TokenExpiredError") { req.Error.tokenExpired(res) }
      else if (err.name = "JsonWebTokenError") { req.Error.noAuthorization(res) }
      else if (err.name = "NoAuthorizationError") { req.Error.noAuthorization(res) }
      else { req.Error.internal(res) }
      return;
    }

    if (!ver || !os || !user){
      req.Error.wrongParameter(res)
      return
    }

    req.AppUser = {
      ver: ver,
      userId: user,
      os: os
    }
    next();
  }
};
