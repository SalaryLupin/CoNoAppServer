const crypto = require("crypto")
const tokenConfig = require("../config/token")

const encryptKey = tokenConfig.encryptKey

module.exports = {

  /** AES256으로 암호화된 토큰을 복호화함 */
  decrypt: (encryptedString) => {
    encryptedString = encryptedString.replace(/\-/gi, "+").replace(/\_/gi, "/")
    const decipher = crypto.createDecipher('aes-256-cbc', encryptKey);
    const result = decipher.update(encryptedString, 'base64', 'utf8');
    result += decipher.final('utf8');
    return result
  },

  /** AES256으로 암호화함 */
  encrypt: (originString) => {
    const cipher = crypto.createCipher('aes-256-cbc', encryptKey);
    const result = cipher.update(originString, 'utf8', 'base64');
    result += cipher.final('base64');
    result = result.replace(/\+/gi, "-").replace(/\//gi, "_").replace(/\=/gi, "")
    return result
  }


}
