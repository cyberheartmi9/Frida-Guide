Java.perform(function () {
	/* Invalidate the certificate pinner set up
    var httpClient = Java.use("okhttp3.OkHttpClient");
    httpClient.builder.certificatePinner.implementation = function(certificatePinner){
        // do nothing
    	console.log("Called!");
    	return this;
    };*/

    // Invalidate the certificate pinnet checks (if "setCertificatePinner" was called before the previous invalidation)
    var CertificatePinner = Java.use("okhttp3.CertificatePinner");
    CertificatePinner.check.overload('java.lang.String', '[Ljava.security.cert.Certificate;').implementation = function(p0, p1){
        // do nothing
        console.log("Called! [Certificate]");
        return;
    };
    CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function(p0, p1){
        // do nothing
        console.log("Called! [List]");
        return;
    };
});