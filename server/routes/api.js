// API ROUTES -------------------
var express = require('express');
var _ = require('lodash');

// TODO: declarer function middleware
//puis //register middleware
//app.use('/route', functionMiddleware)

//var app = require('../index');
//var config = require('./config'); // get our config file
//app.set('superSecret', config.secret); // secret variable

// get an instance of the router for api routes
var apiRoutes = express.Router();
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User = require('../models/adherent');
var db = require('../queries');
//rajout pour lancer script python
var cgi = require('../cgi-python');

// route to authenticate a user (POST http://localhost:8080/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
// find the user
User.where({
  firstname: req.body.name
}).fetch()
.catch(function(err, user) {
  if (err) throw err;
})
.then(function(user){
  if (!user) {
    res.json({ success: false, message: 'Authentication failed. User not found.' });
  } else if (user) {
    // check if password matches
    var myPlaintextPassword = req.body.password
    var hash = user.get('password')
    user.comparePasswords(req.body.password, function(err, res) {
      if(!res){
        //console.error(err);
      }
      else {
        //console.log(res);
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user.toJSON(), app.get('superSecret'), {
          expiresIn: 120 // expires in 24 hours
        });
        // return the information including token as JSON
        /*res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });*/
      }
    })
  }
})
});

//non protégé
// route to show a random message (GET http://localhost:8080/)
apiRoutes.get('/', function(req, res) {
  res.send('<h4>Merci d\'utiliser un token</h4>');
});

// route middleware to verify a token
var protectRoute = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}

apiRoutes.use(protectRoute);
/*
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });

      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});
*/

//en dehors du middleware de verif
apiRoutes.get('/mailleSecteurs/:id/', db.getMaillePolluantSecteur);


// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
    //console.log(req.decoded.access);
    //console.log([req.query.id]);
    //console.log(req.decoded.droits);

    //check si superuser (on ne limite pas l'accès aux ressources)
    if(req.decoded.droits === '*'){
      next()
    }
    else {
    //gestion des ID autorisés pour l'utilisateur
    //on crée une liste des id demandés (avec traitement d'erreur si id est déjà un array)
    try {
      var listeIdDemandes = req.query.id.split(',')
    } catch (e) {
      var listeIdDemandes = req.query.id
    }
    //on crée une liste des id autorisés et on les convertis en string
    var listeIdAutorises = req.decoded.droits.niveau2.id.map(String)//map(val=>val.toString())
    //var bb = listeIdDemandes.every(val=>listeIdAutorises.indexOf(val)>=0)
    if (req.decoded.droits == req.query.id){
      next()
    } else if (
      //_.intersection([parseInt(req.query.id)],req.decoded.droits.id).length > 0
      listeIdDemandes.every(val=>listeIdAutorises.indexOf(val)>=0) // => indexOf doit retourner tout index sauf -1
    ) {
      next()
    } else {
      return res.status(403).send({
          success: false,
          message: 'Ressources non autorisées'
      });
    }
  }
});

//routage
apiRoutes.get('/getAllCommunesAnnee/:id/', db.getAllCommunesAnnee);
apiRoutes.get('/communes', db.getAllCommunes);
apiRoutes.get('/communeSecteurs/:id/', db.getCommunePolluantSecteur);
apiRoutes.get('/communeSecteursPct/:id/', db.getCommunePolluantSecteurPct);
apiRoutes.get('/communeAnneePol/:id/', db.getCommuneAnneePol);
apiRoutes.get('/ordrePol/', db.getOrderPolluant);
apiRoutes.get('/sousSecteurs/', db.getSousSecteur);
apiRoutes.get('/sousSecteursCommuneAnneePol/:id/', db.getCommunePolluantSousSecteur);
apiRoutes.get('/secteursCommunesPol/:id/', db.getCommunePolsSecteurs);
apiRoutes.get('/getGrille/:id/', db.getGrille);
//apiRoutes.get('/getCadastrePolluant/', db.getCadastrePolluant);
//apiRoutes.get('/getCommunesPolluantparCommune/', db.getCommunesPolluantparCommune);
//apiRoutes.get('/cgi/getScale/:pol/', cgi.getScale);
apiRoutes.get('/getTableau/:id/', db.getTableau);
apiRoutes.get('/getBigPie/:id/', db.getBigPie);


// route to return all users (GET http://localhost:8080/users)
/*
apiRoutes.get('/users', function(req, res) {
  User
  //.where({firstname : 'bebs'})
  //.fetch()
    .fetchAll()
    .catch(function(e) {
      throw e;
    })
    .then(function(users){
    res.json(users);
  })
});*/

module.exports = apiRoutes;
