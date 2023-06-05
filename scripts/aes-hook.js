// code borrowed from https://zhuanlan.zhihu.com/p/320229007

'use strict;'

console.log("Script loaded successfully ..... ");

function bytesToString(arr) {
    var str = '';
    arr = new Uint8Array(arr);
    for (var i in arr) {
        str += String.fromCharCode(arr[i]);
    }
    return str;
}

function bytesToHex(arr) {
    var str = '';
    var k, j;
    for (var i = 0; i < arr.length; i++) {
        k = arr[i];
        j = k;
        if (k < 0) {
            j = k + 256;
        }
        if (j < 16) {
            str += "0";
        }
        str += j.toString(16);
    }
    return str;
}

var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    base64DecodeChars = new Array((-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), 62, (-1), (-1), (-1), 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, (-1), (-1), (-1), (-1), (-1), (-1), (-1), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, (-1), (-1), (-1), (-1), (-1), (-1), 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, (-1), (-1), (-1), (-1), (-1));

function bytesToBase64(e) {
    var r, a, c, h, o, t;
    for (c = e.length, a = 0, r = ''; a < c;) {
        if (h = 255 & e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4),
                r += '==';
            break
        }
        if (o = e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
                r += base64EncodeChars.charAt((15 & o) << 2),
                r += '=';
            break
        }
        t = e[a++],
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
            r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
            r += base64EncodeChars.charAt(63 & t)
    }
    return r
}



Java.perform(function () {
    var secretKeySpec = Java.use('javax.crypto.spec.SecretKeySpec');
    secretKeySpec.$init.overload('[B', 'java.lang.String').implementation = function (a, b) {
        var result = this.$init(a, b);
        console.log("================= SecretKeySpec =====================");
        console.log("SecretKeySpec :: bytesToString :: " + bytesToString(a));
        console.log("SecretKeySpec :: bytesToBase64 :: " + bytesToBase64(a));
        console.log("SecretKeySpec :: bytesToBase64 :: " + bytesToHex(a));
        return result;
    }


    var ivParameterSpec = Java.use('javax.crypto.spec.IvParameterSpec');
    ivParameterSpec.$init.overload('[B').implementation = function (a) {
        var result = this.$init(a);
        console.log("\n================== IvParameterSpec ====================");
        console.log("IvParameterSpec :: bytesToString :: " + bytesToString(a));
        console.log("IvParameterSpec :: bytesToBase64 :: " + bytesToBase64(a));
        console.log("IvParameterSpec :: bytesToBase64 :: " + bytesToHex(a));
        return result;
    }

    var cipher = Java.use('javax.crypto.Cipher');
    cipher.getInstance.overload('java.lang.String').implementation = function (a) {
        var result = this.getInstance(a);
        console.log("\n======================================");
        console.log("Cipher :: " + a);
        return result;
    }

    cipher.init.overload('int', 'java.security.Key', 'java.security.spec.AlgorithmParameterSpec').implementation = function (a, b, c) {
        var result = this.init(a, b, c);
        console.log("\n================ cipher.init() ======================");
        
        if (N_ENCRYPT_MODE == '1') 
        {
            console.log("init :: Encrypt Mode");    
        }
        else if(N_DECRYPT_MODE == '2')
        {
            console.log("init :: Decrypt Mode");    
        }
     
        console.log("Mode :: " + a);
        console.log("Secret Key :: " + bytesToHex(b));
        console.log("Secret Key :: " + bytesToBase64(b));
        console.log("IV Param :: " + bytesToHex(c));
        console.log("IV Param :: " + bytesToBase64(c));

        return result;
    }

    cipher.doFinal.overload("[B").implementation = function (x) {
        console.log("\n================ doFinal() ======================");
        var ret = cipher.doFinal.overload("[B").call(this, x);
        console.log("doFinal :: data to encrypt/decrypt - base64 :: " + bytesToBase64(x));
        console.log("doFinal :: data ro encrypt/decrypt - string :: " + bytesToString(x));
        
        return ret;
    }


 
 

});