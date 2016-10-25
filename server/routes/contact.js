'use strict';
var express = require('express');
var Adherent = require('../models/adherent');
var router = express.Router();
router.route('/')
  .get(function(req, res) {
    Adherent
      .fetchAll()
      .then(function(adherent) {
        res.json({ adherent });
      });
  });
module.exports = router;
