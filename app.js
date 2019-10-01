var express = require("express");
var app = express();

// jwt
app.set("jwt-secret", require("./config/token").jwtSecret)

// body parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// custom middleware
const error = require("./middleware/error")
app.use(error.initModule)

// router
app.use("/api", require("./api"))

var sequelize = require('./models/index').sequelize;

app.listen(80, function(){
  console.log("서버가 열렸습니다.");
  sequelize.sync({ force: false })
});

module.exports = app;
