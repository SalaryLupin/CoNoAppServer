/**

ResponseCode
  성공
    - 200 : 요청이 성공
    - 204 : 요청은 성공했지만 보내줄 값이 없음
  실패 - 클라이언트 측
    - 400 : 잘못된 파라메터가 들어가 있음
      {
        err: "Wrong Parameter",
        data: "Parameter Name" // 디버그 시에만 전달
      }
    - 403 : 인증이 안되어있음
      {
        err: "No Authorization"
      }
    - 404 : 찾을 수 없음
  실패 - 서버 측
    - 500 : 알 수 없는 에러
      {
        err: "Internal Server Error"
      }

*/

const express = require("express");
const initRouter = express.Router();

initRouter.use((req, res, next) => {
  req.Error = {
    wrongParameter: (res, data) => res.status(400).json({ err: "Wrong Parameter", data: data }),
    noAuthorization: (res) => res.status(403).json({ err: "No Authorization" }),
    internal: (res) => res.status(500).json({ err: "Internal Server Error" })
  }
  next()
})

module.exports = {

  initModule: initRouter,

}
