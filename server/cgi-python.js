var PythonShell = require('python-shell');
var Promise = require('bluebird');
var asyncPythonShellRun = Promise.promisify(PythonShell.run)

var options = {
  mode: 'text',
  //pythonPath: 'path/to/python',
  pythonOptions: ['-u'],
  scriptPath: 'python/',
  args: ['value1', 'value2', 'value3']
};

function getScale(req, res, next) {
  //pour cadastre pas de ratio
  req.query.ratio?req.query.ratio:null;
  //rajout auto de l'url
  var url = 'http://' + req.app.get('myUrl')
  options.args = [url, req.params.pol, req.query.ratio, req.query.cible, req.query.annee ]

  //utilisation d'une promise
  asyncPythonShellRun('jenkscaspall.py', options)
  .then(function(results){
    var data = results[0]
    res.status(200)
    .json({
      status: 'success',
      data: JSON.parse(data),
      message: 'ok'
    })
  })
  .catch(function(err){
    res.status(403)
    .json({
      status: 'error',
      data: 'error',
      message: err
    })
  }
);

}

module.exports = {
  getScale : getScale
};
