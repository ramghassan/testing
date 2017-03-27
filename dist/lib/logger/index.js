'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _configuration = require('../configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var Logger = function Logger() {
  _classCallCheck(this, Logger);

  this.transports = [];
  if (_configuration2['default'].getEnv() === 'development' || _configuration2['default'].getEnv() === 'local' || _configuration2['default'].getEnv() === 'test') {
    this.transports.push(new _winston2['default'].transports.Console());
  } else {
    this.transports.push(new _winston2['default'].transports.File({
      filename: _configuration2['default'].get('logger:filename'),
      maxsize: 1048576,
      maxFiles: 3,
      level: _configuration2['default'].get('logger:level'),
      logstash: true
    }));
  }
};

exports['default'] = new _winston2['default'].Logger({
  transports: new Logger().transports
});
module.exports = exports['default'];