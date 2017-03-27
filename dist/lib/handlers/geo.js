'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _servicesGeo = require('../services/geo');

var _servicesGeo2 = _interopRequireDefault(_servicesGeo);

var _utilsApputil = require('../utils/apputil');

var _utilsApputil2 = _interopRequireDefault(_utilsApputil);

var _httpAsPromised = require('http-as-promised');

var _httpAsPromised2 = _interopRequireDefault(_httpAsPromised);

var _goodConsole = require('good-console');

var _goodConsole2 = _interopRequireDefault(_goodConsole);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _utilsCacheutil = require('../utils/cacheutil');

var _utilsCacheutil2 = _interopRequireDefault(_utilsCacheutil);

var _utilsJsonapimapper = require('../utils/jsonapimapper');

var _utilsJsonapimapper2 = _interopRequireDefault(_utilsJsonapimapper);

var GeoHandler = function GeoHandler() {
  var _this = this;

  _classCallCheck(this, GeoHandler);

  this.standardHTTPErrors = [{
    code: 400,
    message: 'Bad Request'
  }, {
    code: 500,
    message: 'Internal Server Error'
  }];

  this.get = function () {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Get geo',
      notes: ['Only user with role pearson-admin can call this function.Get geo by comma seperated list of geo Id(s)'],
      validate: {
        query: {
          id: _joi2['default'].string().trim().allow('')
        }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: _this.standardHTTPErrors
        }
      },
      handler: function handler(request, reply) {
        var ids = undefined;
        _logger2['default'].info('Start get geo handler ', { filename: __filename, pid: process.pid });
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          if (!_utilsApputil2['default'].isPearsonAdmin(userSession.roleValue)) {
            return reply(_boom2['default'].methodNotAllowed('User is not pearson admin'));
          }
          var ids = request.query.id;
          if (ids) {
            ids = request.query.id.replace(/\s/g, '').split(',');
          }
          return _this.geoService.get(ids);
        }).then(function (serviceRes) {
          _logger2['default'].info("Response get on geo Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);
        })['catch'](function (err) {
          _logger2['default'].error('Error get on geo Handler....' + JSON.stringify(err));
          return reply(_boom2['default'].badImplementation('Error getting geo', err));
        });
        return _utilsCacheutil2['default'];
      }
    };
  };

  this.put = function () {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Create geo',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        payload: _joi2['default'].object({
          geo: _joi2['default'].array().items({
            name: _joi2['default'].string().trim().required(),
            links: _joi2['default'].object({
              terms: _joi2['default'].string().trim().allow(''),
              privacy: _joi2['default'].string().trim().allow(''),
              cookie: _joi2['default'].string().trim().allow(''),
              moodle: _joi2['default'].string().trim().allow(''),
              services: _joi2['default'].string().trim().allow(''),
              website: _joi2['default'].string().trim().allow(''),
              languagePack: _joi2['default'].string().trim().allow('')
            })
          })
        })
      },
      handler: function handler(request, reply) {
        _logger2['default'].info('Start put geo handler ', { filename: __filename, pid: process.pid });
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          if (!_utilsApputil2['default'].isPearsonAdmin(userSession.roleValue)) {
            return reply(_boom2['default'].methodNotAllowed('User is not pearson admin'));
          }
          var payload = _utilsJsonapimapper2['default'].serialize('geo', request.payload);
          console.log('Payload ---' + request.payload + payload);
          return _this.geoService.put(payload);
        }).then(function (serviceRes) {
          _logger2['default'].info("Response put on geo Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);
        })['catch'](function (responseErr) {
          _logger2['default'].error('Error put on geo Handler....' + JSON.stringify(responseErr));
          if (responseErr.err) return reply(_boom2['default'].badRequest(responseErr.err.message));
          return reply(_boom2['default'].badImplementation('Error in enrolling user', responseErr));
        });
        return _utilsCacheutil2['default'];
      }
    };
  };

  this.geoService = new _servicesGeo2['default']();
};

exports['default'] = GeoHandler;
module.exports = exports['default'];