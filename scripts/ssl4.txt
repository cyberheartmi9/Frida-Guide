/* 
   Android SSL Re-pinning frida script v0.1 @masbog 
   $ frida -U -f it.app.mobile -l frida-android-unpinning-ssl.js
   $ [Samsung GT-I9500::it.app.mobile]-> %resume
   
   or
   
   $ frida --codeshare masbog/frida-android-unpinning-ssl
   $ [Samsung GT-I9500::it.app.mobile]-> %resume
   
   TODO: bypass kony android application
   
   original source code from: https://github.com/sensepost/objection/blob/8974d37733d108762184bb41fe8d0a4f1fffb591/objection/hooks/android/pinning/disable.js
   
*/

setTimeout(function() {
    Java.perform(function() {
        console.log("");
        console.log("[.] Android Cert Pinning Bypass");

        var CertificateFactory = Java.use("java.security.cert.CertificateFactory");
        var FileInputStream = Java.use("java.io.FileInputStream");
        var BufferedInputStream = Java.use("java.io.BufferedInputStream");
        var X509Certificate = Java.use("java.security.cert.X509Certificate");
        var KeyStore = Java.use("java.security.KeyStore");
        var TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");
        var SSLContext = Java.use("javax.net.ssl.SSLContext");
        var X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');
        //var is_android_n = 0;

        //--------
        console.log("[.] TrustManagerImpl Android 7+ detection...");
        // Android 7+ TrustManagerImpl
        // The work in the following NCC blogpost was a great help for this hook!
        // hattip @AdriVillaB :)
        // https://www.nccgroup.trust/uk/about-us/newsroom-and-events/blogs/2017/november/bypassing-androids-network-security-configuration/
        try {
            var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
            // https://github.com/google/conscrypt/blob/c88f9f55a523f128f0e4dace76a34724bfa1e88c/platform/src/main/java/org/conscrypt/TrustManagerImpl.java#L650
            TrustManagerImpl.verifyChain.implementation = function(untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
                console.log("[+] (Android 7+) TrustManagerImpl verifyChain() called. Not throwing an exception.");
                // Skip all the logic and just return the chain again :P
                //is_android_n = 1;
                return untrustedChain;
            }

            PinningTrustManager.checkServerTrusted.implementation = function() {
                console.log("[+] Appcelerator checkServerTrusted() called. Not throwing an exception.");
            }
        } catch (err) {
            console.log("[-] TrustManagerImpl Not Found");
        }

        //if (is_android_n === 0) {
        //--------
        console.log("[.] TrustManager Android < 7 detection...");
        // Implement a new TrustManager
        // ref: https://gist.github.com/oleavr/3ca67a173ff7d207c6b8c3b0ca65a9d8
        var TrustManager = Java.registerClass({
            name: 'com.sensepost.test.TrustManager',
            implements: [X509TrustManager],
            methods: {
                checkClientTrusted: function(chain, authType) {},
                checkServerTrusted: function(chain, authType) {},
                getAcceptedIssuers: function() {
                    return [];
                }
            }
        });

        // Prepare the TrustManagers array to pass to SSLContext.init()
        var TrustManagers = [TrustManager.$new()];

        // Get a handle on the init() on the SSLContext class
        var SSLContext_init = SSLContext.init.overload(
            '[Ljavax.net.ssl.KeyManager;', '[Ljavax.net.ssl.TrustManager;', 'java.security.SecureRandom');

        try {
            // Override the init method, specifying our new TrustManager
            SSLContext_init.implementation = function(keyManager, trustManager, secureRandom) {
                console.log("[+] Overriding SSLContext.init() with the custom TrustManager android < 7");
                SSLContext_init.call(this, keyManager, TrustManagers, secureRandom);
            };
        } catch (err) {
            console.log("[-] TrustManager Not Found");
        }
        //}

        //-------
        console.log("[.] OkHTTP 3.x detection...");
        // OkHTTP v3.x
        // Wrap the logic in a try/catch as not all applications will have
        // okhttp as part of the app.
        try {
            var CertificatePinner = Java.use('okhttp3.CertificatePinner');
            console.log("[+] OkHTTP 3.x Found");
            CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function() {
                console.log("[+] OkHTTP 3.x check() called. Not throwing an exception.");
            };
        } catch (err) {
            // If we dont have a ClassNotFoundException exception, raise the
            // problem encountered.
            console.log("[-] OkHTTP 3.x Not Found")
        }

        //--------
        console.log("[.] Appcelerator Titanium detection...");
        // Appcelerator Titanium PinningTrustManager
        // Wrap the logic in a try/catch as not all applications will have
        // appcelerator as part of the app.
        try {
            var PinningTrustManager = Java.use('appcelerator.https.PinningTrustManager');
            console.log("[+] Appcelerator Titanium Found");
            PinningTrustManager.checkServerTrusted.implementation = function() {
                console.log("[+] Appcelerator checkServerTrusted() called. Not throwing an exception.");
            }

        } catch (err) {
            // If we dont have a ClassNotFoundException exception, raise the
            // problem encountered.
            console.log("[-] Appcelerator Titanium Not Found");
        }

    });
}, 0);