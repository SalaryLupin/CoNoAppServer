var express = require("express");
var app = express();

// body parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// custom middleware
var appUser = require("./middleware/appuser")
app.use(appUser)

// router
app.use("/api", require("./api"))

var sequelize = require('./models/index').sequelize;

app.listen(80, function(){
  console.log("서버가 열렸습니다.");
  sequelize.sync({ force: false })

  // for test case
  var models = require("./models")
  models.User
    .findOne({where: {userId: "TestAccount"}})
    .then(result => {
      if (!result){
        models.User
          .create({userId: "TestAccount", userPw: "Test"})
          .then(console.log("테스트 계정 생성"))
      }
    })
    .catch(console.log("테스트 계정 생성 실패"));
    models.User
      .findOne({where: {userId: "TestAccount1"}})
      .then(result => {
        if (!result){
          models.User
            .create({userId: "TestAccount1", userPw: "Test"})
            .then(console.log("테스트 계정 생성"))
        }
      })
      .catch(console.log("테스트 계정 생성 실패"))

});

module.exports = app;
