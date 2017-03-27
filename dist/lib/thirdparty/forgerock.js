'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _configuration = require('../configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _httpAsPromised = require('http-as-promised');

var _httpAsPromised2 = _interopRequireDefault(_httpAsPromised);

var _httpservice = require('./httpservice');

var _httpservice2 = _interopRequireDefault(_httpservice);

var _servicesServiceResponse = require('../services/ServiceResponse');

var _servicesServiceResponse2 = _interopRequireDefault(_servicesServiceResponse);

var authenticateUrl = _configuration2['default'].get('services:idm:authURL');

var ForgeRockService = (function (_HttpService) {
  _inherits(ForgeRockService, _HttpService);

  /*To Do */

  function ForgeRockService() {
    var _this = this;

    _classCallCheck(this, ForgeRockService);

    _get(Object.getPrototypeOf(ForgeRockService.prototype), 'constructor', this).call(this);

    this.login = function (payload, done) {
      var loginHeaders = {
        'X-OpenAM-Username': payload.username,
        'X-OpenAM-Password': payload.password,
        'Content-Type': 'application/json'
      };
      return _this.httpService.postService(authenticateUrl, loginHeaders, {}, {});
    };

    this.logout = function (token) {
      var logOutUrl = _configuration2['default'].get('services:idm:logoutURL') + '/' + token + "?_action=logout";
      var sessionKeyName = _configuration2['default'].get('services:idm:sessionKeyName');
      var headers = {};
      headers[sessionKeyName] = token;
      headers['Content-Type'] = 'application/json';
      return _this.httpService.postService(logOutUrl, headers, {}, {});
    };

    this.isTokenValid = function (token) {
      var validateTokenUrl = _configuration2['default'].get('services:idm:logoutURL') + '/' + token + "?_action=validate";
      var headers = {
        'Content-Type': 'application/json'
      };
      return _this.httpService.postService(validateTokenUrl, headers, {}, {});
    };

    this.createUser = function (user) {
      var authUrl = _configuration2['default'].get('services:idm:authURL');
      var username = _configuration2['default'].get('services:idm:X-OpenAM-Username');
      var password = _configuration2['default'].get('services:idm:X-OpenAM-Password');
      var createUrl = _configuration2['default'].get('services:idm:createURL');
      var sessionKeyName = _configuration2['default'].get('services:idm:sessionKeyName');
      var authHeaders = {
        'X-OpenAM-Username': username,
        'X-OpenAM-Password': password,
        'Content-Type': 'application/json'
      };
      var createHeaders = {};
      createHeaders['Content-Type'] = 'application/json';
      var userCreationPromise = _this.httpService.postService(authUrl, authHeaders, {}, {}).then(function (response) {
        if (response.tokenId) {
          //call create user
          createHeaders[sessionKeyName] = response.tokenId;
          return _this.httpService.postService(createUrl, createHeaders, {}, user);
        }
        return new _servicesServiceResponse2['default'](err.body, 'Error in creating forgerock', null);
      }).then(function (response) {
        return new _servicesServiceResponse2['default'](null, null, response);
      })['catch'](function (err) {
        return new _servicesServiceResponse2['default'](err.body, 'Error in creating user in forgerock', null);
      });
      return userCreationPromise;
    };

    this.httpService = new _httpservice2['default']();
  }

  return ForgeRockService;
})(_httpservice2['default']);

exports['default'] = ForgeRockService;
module.exports = exports['default'];