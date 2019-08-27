/**
 * php::base64解码器
 * Create at: 2019/08/27 09:59:53
 */

'use strict';
const path = require('path');
var CryptoJS = require(path.join(window.antSword.remote.process.env.AS_WORKDIR, 'node_modules/crypto-js'));

function get_cookie(Name, CookieStr="") {
   var search = Name + "="
   var returnvalue = "";
   if (CookieStr.length > 0) {
     var sd = CookieStr.indexOf(search);
     if (sd!= -1) {
        sd += search.length;
        var end = CookieStr.indexOf(";", sd);
        if (end == -1){
          end = CookieStr.length;
        }
        returnvalue = window.unescape(CookieStr.substring(sd, end));
      }
   } 
   return returnvalue;
}

function encryptByDES(key,message) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
//DES 解密
function decryptByDES(key,ciphertext) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  // direct decrypt ciphertext
  var decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

module.exports = {
  /**
   * @returns {string} asenc 将返回数据base64编码
   * 自定义输出函数名称必须为 asenc
   * 该函数使用的语法需要和shell保持一致
   */
  asoutput: () => {
    return `function asenc($out){
      $key=substr(str_pad(session_id(),8,'a'),0,8);
      return encrypt($key,utf8_encode($out));
    }
    `.replace(/\n\s+/g, '');
  },
  /**
   * 解码 Buffer
   * @param {string} data 要被解码的 Buffer
   * @returns {string} 解码后的 Buffer
   */
  decode_buff: (data, ext={}) => {
    if(data.length === 0) {
      return data;
    }
    let headers = ext.opts.httpConf.headers;
    if(!headers.hasOwnProperty('Cookie')) {
      window.toastr.error("请先设置 Cookie (大小写敏感), 可通过浏览网站获取Cookie", "错误");
      return data;
    }
    let session_key = "PHPSESSID";
    let keyStr = get_cookie(session_key, headers['Cookie']);
    if(keyStr.length === 0) {
      window.toastr.error("未在 Cookie 中发现PHPSESSID", "错误");
      return data;
    }
    if(keyStr.length > 8){
      keyStr = keyStr.substring(0,8)
  
    }else if(keyStr.length < 8){
      let buff = Buffer.alloc(8, 'a');
      buff.write(keyStr,0);
      keyStr = buff.toString();
    }
    return decryptByDES(keyStr, Buffer.from(data).toString());
  }
}