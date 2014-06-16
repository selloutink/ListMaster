String.prototype.to_rfc3986 = function (){ var tmp = encodeURIComponent(this); tmp = tmp.replace('!','%21'); tmp = tmp.replace('*','%2A'); tmp = tmp.replace('(','%28'); tmp = tmp.replace(')','%29'); tmp = tmp.replace("'",'%27'); return tmp; }

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};

var nonce, timestamp, querystring;

function generateSignature(){
	nonce = generateUUID();
	timestamp = new Date().getTime();
	querystring = "ean=8722700463115";
	var privatekey = "sY76ezrweHk3VXvyWLJBHkNdh4a5zVXLRsEYj9R9yxPARkCK1Pvdz6Py4RAYSqjLPZMKt3ESmoRX6CxKlookQQzFSjPutLmSHg4wt-Oc2ghQXZaV-L7PILRj8pohInkbeFiJ4JL0o1eiVEd13q0cuPFGyYAaU8G60VAFpW0LRrM=";
	var httpverb = "GET";
	var requesturl = "http://api.syndicateplus.com/v1/products/product";
	var string = privatekey + httpverb + requesturl + querystring + nonce + timestamp;
	var finalstring = string.to_rfc3986();
	return finalstring;
}

function generateAuthorizationHeader(method, resource, querystring){
	var querystring = querystring;
	// create signature.
	var signature = CryptoJS.SHA1(generateSignature());
	signature = signature.toString(CryptoJS.enc.Base64);
	console.log("HEADER: " + signature);
	// create header
	var key = "Um2TuBS8o_KYCFQ-YmCF6owOprQsNo4ki0qJ0jJJ7CtJmOyDTQhmAPjFHLiKxXC166beu80fqkg3Xcb8D__Yv1V05YO2kQgHAmWuS0Mccf7VZLkqpGhwNIZ5qkowkjRAl4r9eQZSLD9Ior_RbOA-WeHePLxS-2ShSRbglArYOuE=";
	var header = "Key=\"" + key + "\",Timestamp=\"" + timestamp + "\",Nonce=\"" + nonce + "\",Signature=\"" + signature + "\"";
	console.log(header);
	return header;
}

function httprequest(){
var  xmlhttp = new XMLHttpRequest();
    var url = "http://api.syndicateplus.com/v1/products/product?ean=8722700463115";
    xmlhttp.open('GET',url,true);
    xmlhttp.setRequestHeader("Authorization", generateAuthorizationHeader());
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = function() {
            console.log("OnReadystatechange + " + xmlhttp.readyState + " " + xmlhttp.status);
           if (xmlhttp.readyState == 4) {
              if ( xmlhttp.status == 200) {

                   }
                   else {

                   }
             }
             else
                   console.log("Error ->" + xmlhttp.responseText);
          }
}