'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _configuration = require('../configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _httpAsPromised = require('http-as-promised');

var _httpAsPromised2 = _interopRequireDefault(_httpAsPromised);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _thirdpartyForgerock = require('../thirdparty/forgerock');

var _thirdpartyForgerock2 = _interopRequireDefault(_thirdpartyForgerock);

var UserProvider = function UserProvider() {
  var _this = this;

  _classCallCheck(this, UserProvider);

  this.isValidtoken = function (token) {
    return _this.forgeRockService.isTokenValid(token);
  };

  this.forgeRockService = new _thirdpartyForgerock2['default']();
};

exports['default'] = UserProvider;
module.exports = exports['default'];