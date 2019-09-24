var express = require("express");
var app = express();

// body parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// router
app.use("/api", require("./api"))

app.listen(80, function(){
  console.log("서버가 열렸습니다.");
});

module.exports = app;
