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

var _servicesSchooladministration = require('../services/schooladministration');

var _servicesSchooladministration2 = _interopRequireDefault(_servicesSchooladministration);

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

var SchoolAdminHandler = function SchoolAdminHandler() {
  var _this = this;

  _classCallCheck(this, SchoolAdminHandler);

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
      description: 'Get School Administration',
      notes: ['Only user with role pearson-admin can call this function.Get schoolsadministration by comma seperated list of schoolsadministration Id(s)'],
      validate: {
        query: {
          id: _joi2['default'].string().trim().allow(''),
          geoId: _joi2['default'].string().trim().allow('')
        }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: _this.standardHTTPErrors
        }
      },
      handler: function handler(request, reply) {
        _logger2['default'].info('Start get SA handler ', { filename: __filename, pid: process.pid });
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          if (!_utilsApputil2['default'].isPearsonAdmin(userSession.roleValue)) {
            return reply(_boom2['default'].methodNotAllowed('User is not pearson admin'));
          }
          var ids = request.query.id;
          if (ids) {
            ids = request.query.id.replace(/\s/g, '').split(',');
          }
          return _this.schoolAdminService.get(ids, request.query.geoId);
        }).then(function (serviceRes) {
          _logger2['default'].info("Response get on SA Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);
        })['catch'](function (err) {
          _logger2['default'].error('Error get on SA Handler....' + JSON.stringify(err));
          return reply(_boom2['default'].badImplementation('Error getting SA', err));
        });
        return _utilsCacheutil2['default'];
      }
    };
  };

  this.put = function () {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Create School Administration',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        payload: _joi2['default'].object({
          schoolAdmin: _joi2['default'].array().items({
            name: _joi2['default'].string().trim().required(),
            geoId: _joi2['default'].string().trim().required(),
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
        _logger2['default'].info('Start put SA handler ', { filename: __filename, pid: process.pid });
        var payload = undefined;
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          if (!_utilsApputil2['default'].isPearsonAdmin(userSession.roleValue)) {
            return reply(_boom2['default'].methodNotAllowed('User is not pearson admin'));
          }
          payload = _utilsJsonapimapper2['default'].serialize('schoolAdmin', request.payload);
          return _this.schoolAdminService.put(payload);
        }).then(function (serviceRes) {
          _logger2['default'].info("Response put on SA Handler....", JSON.stringify(serviceRes));
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

  this.schoolAdminService = new _servicesSchooladministration2['default']();
  this.geoService = new _servicesGeo2['default']();
};

exports['default'] = SchoolAdminHandler;
module.exports = exports['default'];