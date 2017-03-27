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

var _servicesSchool = require('../services/school');

var _servicesSchool2 = _interopRequireDefault(_servicesSchool);

var _utilsApputil = require('../utils/apputil');

var _utilsApputil2 = _interopRequireDefault(_utilsApputil);

var _httpAsPromised = require('http-as-promised');

var _httpAsPromised2 = _interopRequireDefault(_httpAsPromised);

var _goodConsole = require('good-console');

var _goodConsole2 = _interopRequireDefault(_goodConsole);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _servicesSchooladministration = require('../services/schooladministration');

var _servicesSchooladministration2 = _interopRequireDefault(_servicesSchooladministration);

var _utilsCacheutil = require('../utils/cacheutil');

var _utilsCacheutil2 = _interopRequireDefault(_utilsCacheutil);

var _utilsJsonapimapper = require('../utils/jsonapimapper');

var _utilsJsonapimapper2 = _interopRequireDefault(_utilsJsonapimapper);

var _servicesEnrolluser = require('../services/enrolluser');

var _servicesEnrolluser2 = _interopRequireDefault(_servicesEnrolluser);

var SchoolHandler = function SchoolHandler() {
  var _this = this;

  _classCallCheck(this, SchoolHandler);

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
      description: 'Get School',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        params: {
          schoolid: _joi2['default'].string().trim().required()
        }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: _this.standardHTTPErrors
        }
      },
      handler: function handler(request, reply) {
        _logger2['default'].info('Start get School handler ', { filename: __filename, pid: process.pid });
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          if (!_utilsApputil2['default'].isPearsonAdmin(userSession.roleValue)) {
            return reply(_boom2['default'].methodNotAllowed('User is not pearson admin'));
          }
          return _this.schoolService.get(request.params.schoolid);
        }).then(function (serviceRes) {
          _logger2['default'].info("Response get on School Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);
        })['catch'](function (err) {
          _logger2['default'].error('Error get on School Handler....' + JSON.stringify(err));
          return reply(_boom2['default'].badImplementation('Error getting school', err));
        });
        return _utilsCacheutil2['default'];
      }
    };
  };

  this.put = function () {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Create School',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        payload: _joi2['default'].object({
          school: _joi2['default'].array().items({
            name: _joi2['default'].string().trim().required(),
            saId: _joi2['default'].string().trim().required(),
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
        _logger2['default'].info('Start put school handler ', { filename: __filename, pid: process.pid });
        var payload = undefined;
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          if (!_utilsApputil2['default'].isPearsonAdmin(userSession.roleValue)) {
            return reply(_boom2['default'].methodNotAllowed('User is not pearson admin'));
          }
          payload = _utilsJsonapimapper2['default'].serialize('school', request.payload);
          return _this.schoolService.put(payload);
        }).then(function (serviceRes) {
          _logger2['default'].info("Response put on school Handler....", JSON.stringify(serviceRes));
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

  this.getSchools = function () {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'get schools by Id(s) or saId or geoId',
      notes: ['get schools by Id(s) or saId or geoId'],
      validate: {
        query: {
          id: _joi2['default'].string().trim(),
          saId: _joi2['default'].string().trim(),
          geoId: _joi2['default'].string().trim()
        }
      },
      handler: function handler(request, reply) {
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          var isPearsonAdmin = _utilsApputil2['default'].isPearsonAdmin(userSession.roleValue);
          var userId = userSession.userId;
          if (request.query.id) {
            request.query.id = request.query.id.replace(/\s/g, '').split(',');
          }
          if (!isPearsonAdmin && request.query.saId) {
            return _boom2['default'].methodNotAllowed('saId is allowed only for pearson admin');
          } else if (!isPearsonAdmin && request.query.geoId) {
            return _boom2['default'].methodNotAllowed('geoId is allowed only for pearson admin');
          } else {
            return _this.schoolService.getSchools(request.query.geoId, request.query.saId, request.query.id, userId, isPearsonAdmin);
          }
        }).then(function (schools) {
          return reply(schools);
        })['catch'](function (err) {
          _logger2['default'].error('Error on getSchools....' + JSON.stringify(err));
          return reply(_boom2['default'].badImplementation('Error in getSchools', err));
        });
        return promise;
      }
    };
  };

  this.enrollUser = function () {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Enroll user to  a school',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        payload: _joi2['default'].object({
          enrollment: _joi2['default'].array().items({
            userId: _joi2['default'].string().trim().required(),
            schoolId: _joi2['default'].string().trim().required(),
            roleValue: _joi2['default'].string().trim().required()
          })
        })
      },
      handler: function handler(request, reply) {
        _logger2['default'].info('Start put on enrolluser  handler ', { filename: __filename, pid: process.pid });
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          if (!_utilsApputil2['default'].isPearsonAdmin(userSession.roleValue)) {
            return reply(_boom2['default'].methodNotAllowed('User is not pearson admin'));
          }
          var payload = _utilsJsonapimapper2['default'].serialize('enrollment', request.payload);
          return _this.enrolluserService.put(payload);
        }).then(function (response) {
          _logger2['default'].info("Response put on enrolluser Handler....", JSON.stringify(response));
          return reply(response);
        })['catch'](function (responseErr) {
          _logger2['default'].error('Error put on enrolluser Handler....' + JSON.stringify(responseErr));
          if (responseErr.err) return reply(_boom2['default'].badRequest(responseErr.err.message));
          return reply(_boom2['default'].badImplementation('Error in enrolling user', responseErr));
        });
      }
    };
  };

  this.schoolService = new _servicesSchool2['default']();
  this.schoolAdminService = new _servicesSchooladministration2['default']();
  this.enrolluserService = new _servicesEnrolluser2['default']();
};

exports['default'] = SchoolHandler;
module.exports = exports['default'];