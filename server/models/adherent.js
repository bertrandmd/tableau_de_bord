'use strict';
var bcrypt = require('bcrypt');
var Promise  = require('bluebird');
var bookshelf = require('../bookshelf');

var Adherent = bookshelf.Model.extend({
  tableName: 'adherents',  initialize: function() {
    this.on('creating', this.hashPassword, this);
    this.on('updating', this.hashPassword, this);
    //this.on('creating', this.comparePasswords, this);
  },
  comparePasswords: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(err, isMatch);
    });
  },
  hashPassword: function(model, attrs, options) {
    return new Promise(function(resolve, reject) {
      if(model.changed.password){
        bcrypt.hash(model.attributes.password, 10, function(err, hash) {
          if( err ) reject(err);
          model.set('password', hash);
          resolve(hash); // data is created only after this occurs
        });
      }
      else {
        resolve()
      }
    });
  }
});
module.exports = Adherent;
