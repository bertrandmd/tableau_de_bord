
//ApiRequest iife
module.exports = (function () {
    //var ApiRequest = {};
    return {
      //requete XHR
      request : function(target,callback,arg) {
        var arg = arg || '';
        var xhr = new XMLHttpRequest();
        /*if(token){
          xmlhttp.setRequestHeader("x-access-token", token);
        }*/
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            callback(xhr.responseText, arg);
            //document.getElementById("loader").style.display = "none";
          }
          else if (xhr.readyState < 4) {
            //document.getElementById("loader").style.display = "inline";
            if (xhr.status == 404){
              //document.getElementById("loader").style.display = "none";
              alert("Not found");
            }
          }
        };
        xhr.open("GET", target, true);
        xhr.send();
      },
      request2 : function (method, url) { //http://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = resolve;
            xhr.onerror = reject;
            xhr.send();
        });
      },
      request3 : function (method, url, params) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url,true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //xhr.setRequestHeader("Content-length", params.length);
            //xhr.setRequestHeader("Connection", "close");
            xhr.onload = resolve;
            xhr.onerror = reject;
            xhr.send(params);
        });
      }
    }
}());
