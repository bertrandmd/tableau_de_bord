// CGI ROUTES -------------------
// TODO: faire une sous route de /api ?
var express = require('express');
var _ = require('lodash');

// get an instance of the router for api routes
var cgiRoutes = express.Router();

var db = require('../queries');
//rajout pour lancer script python
var cgi = require('../cgi-python');

// no-middleware
// TODO: a rajouter sous forme de fonction

cgiRoutes.get('/getCadastrePolluant/', db.getCadastrePolluant);
cgiRoutes.get('/getCommunesPolluantparCommune/', db.getCommunesPolluantparCommune);
cgiRoutes.get('/getScale/:pol/', cgi.getScale); //'/cgi/getScale/:pol/'



module.exports = cgiRoutes;
