// Proper way to initialize and share the Database object

var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
/*var cn = {
    host: 'localhost', // server name or IP address;
    port: 5432,
    database: 'my_db_name',
    user: 'user_name',
    password: 'user_password'
};*/
var connectionString = 'postgres://api:pietrasanta@172.16.18.9:5432/apiinventaireSvg';
//var connectionString = 'postgres://bertrand_mathieudaude:MgebAS9U@62.102.230.3:5432/icare_airlr_3.1';
var db = pgp(connectionString);//cn

// Exporting the database object for shared use:
module.exports = db;
