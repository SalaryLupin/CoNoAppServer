/*
미들웨어 이름 : App user
커스텀 헤더 정보를 통해 앱 유저의 정보를 보기 쉽게 만든다.
   - 토큰 정보를 통해 계정 관리하기
   - iOS 유저인지 Android 유저인지 확인하기
   - 앱 버전 관리하기
*/

const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const coder = require("../../util/coder")

function parseToken(token, secret){

  if (!token) return null;
  token = coder.decrypt(token)
  try {
    let decoded = jwt.verify(token, secret)
    if (decoded) {
      console.log(decoded.userId + ", " + decoded.exp)
      return decoded.userId
    }
  }
  catch (e){
    throw e;
  }
}

module.exports = {
  module: router,
  checkLogin: function(req, res, next){

    // 데이터 파싱
    let ver = req.header("Ver");
    let os = req.header("Os");
    let token = req.header("Token");
    var user = ""
    try {
      user = parseToken(token, req.app.get("jwt-secret"));
    }
    catch(e){
      req.Error.tokenExpired(res)
      return;
    }


    if (!ver || !os || !token || !user){
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
