
var L = require('leaflet');
// Indiquer le chemin vers le dossier d'images de Leaflet
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';
require('leaflet-ajax')//(L);

window.Handlebars = require('handlebars');
//require('./handlebars/math.js');
require('./handlebars/if.js');

var math = require('handlebars-helpers').math();

Handlebars.registerHelper("divide", math.divide)
Handlebars.registerHelper("round", math.round)
Handlebars.registerHelper("multiply", math.multiply)

var HandlebarsIntl = require('handlebars-intl');
HandlebarsIntl.registerWith(Handlebars);

require("bootstrap")
require('bootstrap-multiselect');

//Highcharts
window.Highcharts = require('highcharts');
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
require('highcharts-export-csv')(Highcharts);
require('./highcharts/themes/inventaire.js')//(Highcharts);
require('highcharts-more')(Highcharts);

window.UrlBuilder = require('./modules/UrlBuilder.js');
window.GraphsBuilder = require('./modules/Graphs.js');
window.ApiRequest = require('./modules/ApiRequest.js');
window.Promise_ = require('bluebird');
window.graphsConf = require ('./modules/graphs_conf.js')
window.D3_ = require('./modules/D3Builder.js')

window.Colorbrewer = require('colorbrewer')

//require('d3-tip')
var d3tip = require('d3-tip')(d3);

window.turf = require('turf');
turf.filter = require('turf-filter');
turf.featurecollection = require('turf-featurecollection');

window.d3fc = require('d3fc-label-layout');

window._ = require('lodash');
window.jwt = require('jsonwebtoken');

require('../css/app.css');
