'use strict';

var nconf = require('nconf');

function Config() {
  nconf.argv().env('_');
  nconf.use('memory');
  var environment = nconf.get('NODE:ENV') || 'development';
  nconf.file(environment, nconf.get('NODE:CONFIG:FILE') || 'config/' + environment + '.json');
  nconf.file('default', 'config/default.json');
}

Config.prototype.get = function (key) {
  return nconf.get(key);
};

Config.prototype.getEnv = function () {
  return nconf.get('NODE:ENV') || 'development';
};

module.exports = new Config();