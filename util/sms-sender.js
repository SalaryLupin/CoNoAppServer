
const request = require("request");
const cheerio = require('cheerio');
const config = require("../config/sms.js")

module.exports = {

  sendSMS: (targets, body, callback) => {
    const url = "https://api-sens.ncloud.com/v1/sms/services/" + config.serviceId + "/messages"
    const options = {
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
      if (err) {
        callback(err, null)
        return;
      }

      if (body.status == 200) {
        callback(null, body)
      }
      else {
        callback("error", body)
      }
    });

  }



}
