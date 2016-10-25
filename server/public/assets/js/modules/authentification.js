//Gestion du token d'autorisation de l'API inventaire.
decoded = (function () {
   var token = document.querySelector('meta[name="token"]')['content']
   console.log(token);
   var decoded = token !== 'public' ? jwt.decode(token) : undefined ;

   //$('#alert_template').append('<br/>Token : ' + token)

   //Surcharge de XHR pour intégrer le token au header
   XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
   // here "this" points to the XMLHttpRequest Object.
   var newSend = function(vData) {
     this.setRequestHeader('x-access-token', token);
     this.realSend(vData);
   };
   XMLHttpRequest.prototype.send = newSend;

   return decoded;

}());
