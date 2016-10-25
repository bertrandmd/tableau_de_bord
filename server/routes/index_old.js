var express = require('express');
var router = express.Router();

var db = require('../queries');
//rajout pour lancer script python
var cgi = require('../cgi-python');

router.get('/api/getAllCommunesAnnee/:id/', db.getAllCommunesAnnee);
router.get('/api/communes', db.getAllCommunes);
router.get('/api/puppies', db.getAllPuppies);
router.get('/api/puppies/:id/', db.getCommunePolluant);
router.get('/api/communeSecteurs/:id/', db.getCommunePolluantSecteur);
router.get('/api/communeSecteursPct/:id/', db.getCommunePolluantSecteurPct);
router.get('/api/communeAnneePol/:id/', db.getCommuneAnneePol);
router.get('/api/ordrePol/', db.getOrderPolluant);
router.get('/api/sousSecteurs/', db.getSousSecteur);
router.get('/api/sousSecteursCommuneAnneePol/:id/', db.getCommunePolluantSousSecteur);
router.get('/api/secteursCommunesPol/:id/', db.getCommunePolsSecteurs);
router.get('/api/getGrille/:id/', db.getGrille);
//router.post('/api/puppies', db.createPuppy);
//router.put('/api/puppies/:id', db.updatePuppy);
//router.delete('/api/puppies/:id', db.removePuppy);
router.get('/api/hello/', db.hello);
router.get('/api/getCadastrePolluant/', db.getCadastrePolluant);
router.get('/api/getCommunesPolluantparCommune/', db.getCommunesPolluantparCommune);
router.get('/cgi/getScale/:pol/', cgi.getScale);
router.get('/api/getTableau/:id/', db.getTableau);
router.get('/api/getBigPie/:id/', db.getBigPie);
router.get('/api/mailleSecteurs/:id/', db.getMaillePolluantSecteur);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
