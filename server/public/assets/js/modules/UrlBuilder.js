var querystring = require('querystring');

function UrlBuilder(url/*,token*/){
  this.URL_SERVER = url;
  //if(token){this.TOKEN = token}
}

UrlBuilder.prototype = {

  getUrl1 : function(arg) {
    return this.URL_SERVER + arg

  },
  //CGI python
  getScale : function(options){
    var options = options || {
      polluant : 'NOX',
      cible : 'cadastre', //'commune'
      //ratio : 'pop2013', //'surf_km'
      annee : '2012'
    }
    //if(this.TOKEN) {Object.assign(options,{token: this.TOKEN})}
    var polluant = options.polluant
    var queryUrl = querystring.stringify(options)
    var url = this.URL_SERVER + '/cgi/getScale/' + polluant + '?' + queryUrl ;
    //nom?url += '&nom=' + nom:0;
    return url
  },
  //BigPie
  getBigPie : function(options){
    var options = options || {
      id : '34172',
      pol : 'NOX',
      annee : '2012'
    }
    //if(this.TOKEN) {Object.assign(options,{token: this.TOKEN})}
    var id = options.id
    delete options.id;
    var queryUrl = querystring.stringify(options)
    var url = this.URL_SERVER + '/api/getBigPie/' + id + '?' + queryUrl ;
    //nom?url += '&nom=' + nom:0;
    return url
  },
  //tooltip
  getSecteursParMaille : function(options){
    var options = options || {
      id : '34172',
      pol : 'NOX',
      annee : '2012'
    }
    //if(this.TOKEN) {Object.assign(options,{token: this.TOKEN})}
    var id = options.id
    delete options.id;
    var queryUrl = querystring.stringify(options)
  	var url = this.URL_SERVER + '/api/mailleSecteurs/' + id + '?' + queryUrl ;
  	//nom?url += '&nom=' + nom:0;
  	return url
  },
  //pour les secteurs : createXadrr
  getSecteursParCommunes : function(options){
    var options = options || {
      id : '34172',
      pol : 'NOX',
      annee : '2012',
      nom : 'Montpellier'
    }
    //if(this.TOKEN) {Object.assign(options,{token: this.TOKEN})}
    var id = options.id
    delete options.id;
    var queryUrl = querystring.stringify(options)
  	var url = this.URL_SERVER + '/api/communeSecteurs/' + id + '?' + queryUrl ;
  	//nom?url += '&nom=' + nom:0;
  	return url
  },
  //createXadrrComAnnPol
  getPolluantsParAnneeParCommunes : function(options){
  //if(this.TOKEN) {Object.assign(options,{token: this.TOKEN})}
    var id = options.id
    delete options.id;
    var queryUrl = querystring.stringify(options)
  	var url = this.URL_SERVER + '/api/communeAnneePol/' + id + '?' + queryUrl ;
  	return url
  },
  //createXadrrSecteursCommunesPol
  getSecteursParPolluantParCommunes : function(options){
  //if(this.TOKEN) {Object.assign(options,{token: this.TOKEN})}
    var id = options.id
    delete options.id;
    var queryUrl = querystring.stringify(options)
    var url = this.URL_SERVER + '/api/secteursCommunesPol/' + id + '?' + queryUrl ;
  	return url
  },
  //createXadrrSousSecteurComAnnPol
  getSousSecteurParSecteurParPolluantParCommune : function(options){
  //if(this.TOKEN) {Object.assign(options,{token: this.TOKEN})}
    var id = options.id
    delete options.id;
    var queryUrl = querystring.stringify(options)
    var url = this.URL_SERVER + '/api/sousSecteursCommuneAnneePol/' + id + '?' + queryUrl ;
  	return url
  },
  //createXadrrgetGrille //09/08/2016 : rajout de l'id dans la query, sinon ne passe pas le middleware de verif d'express
  getGrille : function(id, polluant){
  //if(this.TOKEN) {Object.assign(options,{token: this.TOKEN})}
  	var url = this.URL_SERVER + '/api/getGrille/' + id + '?id=' + id + '&pol=' + polluant;
  //  if(this.TOKEN) {url += '&token=' + this.TOKEN}
  	return url
  },
  getPolluantparAnneeToutesCommunes : function(options){
  //if(this.TOKEN) {Object.assign(options,{token: this.TOKEN})}
    var id = options.id
    delete options.id;
    var queryUrl = querystring.stringify(options)
    var url = this.URL_SERVER + '/api/getAllCommunesAnnee/' + id + '?' + queryUrl ;
  	return url
  },
  getTableauParEntite : function(options){

  //  if(this.TOKEN) {Object.assign(options,{token: this.TOKEN})}
    var id = options.id
    delete options.id;
    var queryUrl = querystring.stringify(options)
    var url = this.URL_SERVER + '/api/getTableau/' + id + '?' + queryUrl ;
    return url
  }

}

module.exports = UrlBuilder;
