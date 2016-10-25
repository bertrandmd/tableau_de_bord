'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var morgan = require('morgan');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var path    = require("path");

var app = express();

//variables
var PORT = process.env.PORT || 3001;
app.set('superSecret', config.secret); // secret variable
app.set('myUrl', config.url); // url du server

app.listen(PORT, function() {
  console.log('Server listening on port %s.', PORT);
});


//moteur de template
var exphbs = require('express-handlebars');//https://github.com/ericf/express-handlebars
var hbs = exphbs.create({
  defaultLayout: 'main', extname: '.hbs',
  // Specify helpers which are only registered on this instance.
  helpers: {
    if_eq : function(a, b, opts) {
      if (a == b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    }
  }
});
app.engine('.hbs', hbs.engine);//exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//dispo des scripts publics
app.use('/', express.static(__dirname + '/public/assets'));
app.use('/node_modules/font-awesome', express.static(__dirname + '/node_modules/font-awesome'));

var contactRoute = require('./routes/contact');
var User = require('./models/adherent');
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));//combined

//app.use(bodyParser.urlencoded({ extended: true }));
app.use('/contact', contactRoute);

//Routage
//var routes = require('./routes/index');
var apiRoutes = require('./routes/api');
var cgiRoutes = require('./routes/cgi');

// basic route
app.get('/', function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
      if (err) {
        //return res.json({ success: false, message: 'Failed to authenticate token.' });
        return res.render('index');
      } else {
        // if everything is good, save to request for use in other routes
        req.body.decoded = decoded
        next();
      }
    });
  } else {
    //console.log('no token');
    var options = {
      title : 'Tableau de Bord Inventaire, &c AIR LR'
    }
    if (req.query.error){
      options.error = req.query.error
    }
    res.render('index', options);
  }
}, function (req, res, next) { //suite du Middleware avec infos du token
  //console.log(req.body.token);
  res.render('index', {
    user: req.body.decoded.name,
    token : req.query.token,
    role : req.body.decoded.role,
    message : 0,//message,
    success : 0,//success,
    title : 'Tableau de Bord Inventaire, &c AIR LR'
  });
});


// route middleware to verify a token
app.post('/login', function(req, res, next) {
  // find the user
  User.where({
    name: req.body.name
  }).fetch()
  .catch(function(err, user) {
    if (err) throw err;
  })
  .then(function(user){
    if (!user) {
      //res.json({ success: false, message: 'Authentication failed. User not found.' });
      res.render('index');
    } else if (user) {
      // check if password matches
      //var myPlaintextPassword = req.body.password
      //var hash = user.get('password')
      user.comparePasswords(req.body.password, function(err, isMatch) {
        if(err){
          console.error(err);
          //res.end();
        } else {
          if (!isMatch) {
            var string = encodeURIComponent('connexion');
            //req.headers.authorization = 'aket';
            //res._headers['x-access-token'] = req.body.token
            res.redirect('/?error=' + string);
            //res.json({ success: false, message: 'Authentication failed' });
            //res.render('index');
          } else {
            // if user is found and password is right
            // create a token
            var tokenInfo = {
              name : user.get('name'),
              email : user.get('email'),
              role: user.get('role')
            }
            //check role de l'userAgent
            if(user.get('role')=='superAdmin'){
              //wildcard sur le server & l'API
              tokenInfo['droits'] = '*'
            } else if(user.get('role')=='admin'){
              //wildcard sur l'API
              tokenInfo['droits'] = '*'
            } else {
              tokenInfo['droits'] = user.get('droits')
            }
            var token = jwt.sign(tokenInfo, app.get('superSecret'), { //user.toJSON()
              expiresIn: 86400//24h // expires in (1200)10min
            });
            res.app.user = {
              user: user.get('name'),
              role: user.get('role'),
              token : token
            }
            req.body.token = token;
            //console.log(req.accepts('application/json'));
            //console.log('new token');
            //res.redirect('/');*
            next();
          }
        }
      });
    }
  });
},  function(req, res, next) {
  var string = encodeURIComponent(req.body.token);
  //req.headers.authorization = 'aket';
  res._headers['x-access-token'] = req.body.token
  res.redirect('/?token=' + string);
});

app.post('/logout', function(req, res) {
  delete req.user;
  delete res.app.user
  //req.session.destroy(function(){
  res.redirect('/');
  //});
});
//middleware qui protege l'accès a '/setup'
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

app.use('/setup', protectRoute, function (req, res, next) { //Ajout d'un double check sur les droits de superAdmin
    if (req.decoded.role === 'superAdmin') {
      next()
    }
    else{
      return res.json({ success: false, message: 'Vous n\'avez pas les droits nécessaires.'});
    }
});

app.post('/setup', function(req, res) {
  // create a sample user
  var adherent = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    droits : req.body.droits,
    role : req.body.role
  });
  // save the sample user
  adherent.save().catch(function(e) {
    //
    var message = {
      succes : false,
      message : 'Erreur, utilisateur ' + req.body.name + ' non créé. ' + e.message
    }
    res.json(message);
    throw e;
  })
  .then(function(adherent){
    //req.app.user
    console.log('User saved successfully');
    var message = {
      success : true,
      message : 'L\'utilisateur ' + adherent.get('name') + ' a bien été créé.'
    }
    res.json(message);
  })
})
app.put('/setup', function(req, res) {

  //check si le json est bien constitué d'un array de text
  //à terminer
  var droits;
  if(req.body.droits){
    var data = req.body.droits;
    //console.log(data);
    var data2 = JSON.parse(data)
    //console.log(data2.niveau1);
    data.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
    function convert(id){
      if (!Array.isArray(id)) {
        return id.toString()
      } else {
        return id.map(i=>i.toString())
      }
    }
    data2.niveau2.id = convert(data2.niveau2.id)
    droits = JSON.stringify(data2)
    //console.log(data2.niveau2.id);
  } else {
    droits = null;
  }

  //update user
  User.forge({name: req.body.name})
 .fetch({require: true})
 .then(function (user) {
   var updateUser = {
     name: req.body.name || user.get('name'),
     email: req.body.email || user.get('email'),
     droits : droits || user.get('droits'),//req.body.droits || user.get('droits'),
     role : req.body.role || user.get('role')
   }
   if (req.body.password) {updateUser.password = req.body.password}
   user.save(updateUser)
   .then(function () {
     //res.json({error: false, data: {message: 'User details updated'}});
     res.json({success: true, message: 'User details updated'});
   })
   .catch(function (err) {
     res.status(500).json({success: false, message: err.message});
   });
 })
 .catch(function (err) {
   res.status(500).json({success: false, message: err.message});
 });
});

// on précise ici qu'on autorise toutes les sources
// puis dans le second header, quels headers http sont acceptés
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // Set custom headers for CORS
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  //permet le preflight
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

/*
// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
app.all('/api/v1/*', [require('./middlewares/validateRequest')]); ==> rq : .all utilise un array de callback, d'où le [fonction]
*/
// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// apply the routes to our application with the prefix /cgi
app.use('/cgi', cgiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //console.log(req);
  var err = new Error('Not Found');
  err.status = 404;
  next();
  //debug :
  //next(err);
});



//module
module.exports = app;
