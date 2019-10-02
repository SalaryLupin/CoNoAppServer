
const request = require("request");
const cheerio = require('cheerio');
const config = require("../config/sns.js")

module.exports = {

  sendSNS: (targets, body, callback) => {
    let url = "https://api-sens.ncloud.com/v1/sms/services/" + config.serviceId + "/messages"
    let options = {
      uri: url,
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-ncp-auth-key": config.serviceAccess,
        "x-ncp-service-secret": config.serviceSecret
      },
      body: {
        type: "SMS",
        from: config.serviceSender,
        to: targets,
        content: body
      },
      json: true
    }

    request.post(options, function(err, response, body){
      console.log("hello?")
      if (err) {
        console.log("hello? 1")
        callback(err, null)
        return;
      }

      if (body.status == 200) {
        console.log("hello? 2")
        callback(null, body)
      }
      else {
        console.log("hello? 3")
        callback("error", body)
      }
    });

  }



}
