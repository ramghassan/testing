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

var _servicesAsset = require('../services/asset');

var _servicesAsset2 = _interopRequireDefault(_servicesAsset);

var _utilsApputil = require('../utils/apputil');

var _utilsApputil2 = _interopRequireDefault(_utilsApputil);

var AssetHandler = function AssetHandler() {
  var _this = this;

  _classCallCheck(this, AssetHandler);

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
      description: 'Get Asset',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        query: {
          id: _joi2['default'].string().trim().required()
        }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: _this.standardHTTPErrors
        }
      },
      handler: function handler(request, reply) {
        _logger2['default'].info('Start get asset handler ', { filename: __filename, pid: process.pid });
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          /*  if(!AppUtil.isPearsonAdmin(userSession.roleValue) || !request.headers.padminToken){            
              return reply(Boom.methodNotAllowed('User is not pearson admin')); 
            }
            console.log(request.headers);*/
          var ids = request.query.id;
          if (ids) {
            ids = request.query.id.replace(/\s/g, '').split(',');
          }
          return _this.assetsService.get(ids);
        }).then(function (serviceRes) {
          console.log("typeof serviceRes ", typeof serviceRes);
          _logger2['default'].info("Response get on asset Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);
        })['catch'](function (err) {
          _logger2['default'].error('Error get on asset Handler....' + JSON.stringify(err));
          return reply(_boom2['default'].badImplementation('Error getting asset', err));
        });
        return _utilsCacheutil2['default'];
      }
    };
  };

  this.put = function () {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Create assets',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        payload: _joi2['default'].object({
          asset: _joi2['default'].array().items({
            name: _joi2['default'].string().trim().required(),
            description: _joi2['default'].string().trim().required(),
            contentTypeValue: _joi2['default'].string().trim().required(),
            fileType: _joi2['default'].string().trim().required(),
            url: _joi2['default'].string().trim().required(),
            thumbnailUrl: _joi2['default'].string().trim().allow(''),
            purposes: _joi2['default'].array().items(_joi2['default'].string().trim().allow('')),
            section: _joi2['default'].string().trim().allow(''),
            topic: _joi2['default'].object({
              name: _joi2['default'].string().trim().allow(''),
              subtopic: _joi2['default'].object({
                name: _joi2['default'].string().trim().allow(''),
                subtopic: _joi2['default'].object({
                  name: _joi2['default'].string().trim().allow('')
                })
              })
            }),
            lookUp: _joi2['default'].object({
              originId: _joi2['default'].string().trim().required(),
              source: _joi2['default'].string().trim().required()
            }).required()
          })
        })
      },
      handler: function handler(request, reply) {
        _logger2['default'].info('Start put assets handler ', { filename: __filename, pid: process.pid });
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          if (!_utilsApputil2['default'].isPearsonAdmin(userSession.roleValue)) {
            return _boom2['default'].methodNotAllowed('User is not pearson admin');
          }
          var payload = _utilsJsonapimapper2['default'].serialize('asset', request.payload);
          return _this.assetsService.put(payload);
        }).then(function (serviceRes) {
          _logger2['default'].info("Response put on assets Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);
        })['catch'](function (responseErr) {
          _logger2['default'].error('Error put on assets Handler....' + JSON.stringify(responseErr));
          if (responseErr.err) return reply(_boom2['default'].badRequest(responseErr.err.message));
          return reply(_boom2['default'].badImplementation('Error in assets Handler', responseErr));
        });
        return promise;
      }
    };
  };

  this.assetSchool = function () {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Provision asset to school',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        payload: _joi2['default'].object({
          assetSchool: _joi2['default'].array().items({
            schoolId: _joi2['default'].string().trim().required(),
            assetId: _joi2['default'].string().trim().required()
          })
        })
      },
      handler: function handler(request, reply) {
        _logger2['default'].info('Start put assetSchool handler ', { filename: __filename, pid: process.pid });
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          if (!_utilsApputil2['default'].isPearsonAdmin(userSession.roleValue)) {
            return _boom2['default'].methodNotAllowed('User is not pearson admin');
          }
          var payload = _utilsJsonapimapper2['default'].serialize('assetSchool', request.payload);
          return _this.assetsService.assetSchool(payload);
        }).then(function (serviceRes) {
          _logger2['default'].info("Response put on assetSchool Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);
        })['catch'](function (responseErr) {
          _logger2['default'].error('Error put on assetSchool Handler....' + JSON.stringify(responseErr));
          if (responseErr.err) return reply(_boom2['default'].badRequest(responseErr.err.message));
          return reply(_boom2['default'].badImplementation('Error in assetSchool Handler', responseErr));
        });
        return promise;
      }
    };
  };

  this.getAssetSchool = function () {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Get School Asset',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        query: {
          id: _joi2['default'].string().trim().allow(''),
          schoolId: _joi2['default'].string().trim().allow('')
        }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: _this.standardHTTPErrors
        }
      },
      handler: function handler(request, reply) {
        _logger2['default'].info('Start get school asset handler ', { filename: __filename, pid: process.pid });
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          if (!_utilsApputil2['default'].isPearsonAdmin(userSession.roleValue)) {
            return reply(_boom2['default'].methodNotAllowed('User is not pearson admin'));
          }
          var ids = request.query.id;
          var schoolIds = request.query.schoolId;
          if (ids) {
            ids = request.query.id.replace(/\s/g, '').split(',');
          }
          if (schoolIds) {
            schoolIds = request.query.schoolId.replace(/\s/g, '').split(',');
          }
          return _this.assetsService.getAssetSchool(ids, schoolIds);
        }).then(function (serviceRes) {
          _logger2['default'].info("Response get on school asset Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);
        })['catch'](function (err) {
          _logger2['default'].error('Error get on school asset Handler....' + JSON.stringify(err));
          return reply(_boom2['default'].badImplementation('Error getting school asset', err));
        });
        return _utilsCacheutil2['default'];
      }
    };
  };

  this.assetAuthorized = function () {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'api to check user is authorized for an asset',
      validate: {
        headers: _joi2['default'].object({
          assetid: _joi2['default'].string().trim().required()
        }).options({ allowUnknown: true })
      },
      notes: ['User with role pearson-admin always return 200 and for others, user and asset must be mapped to at least 1 common school'],
      handler: function handler(request, reply) {
        _logger2['default'].info('Start put assetAuthorized handler ', { filename: __filename, pid: process.pid });
        var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
          _logger2['default'].info("Response on userSession....", JSON.stringify(userSession));
          var payload = { "userId": userSession.userId, "roleValue": userSession.roleValue, "token": request.headers.authorization.split(' ')[1], "assetId": request.headers.assetid };
          _logger2['default'].info("Response on payload....", JSON.stringify(payload));
          return _this.assetsService.assetAuthorized(payload);
        }).then(function (serviceRes) {
          _logger2['default'].info("Response put on assetAuthorized Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);
        })['catch'](function (responseErr) {
          _logger2['default'].error('Error put on assetAuthorized Handler....' + JSON.stringify(responseErr));
          if (responseErr.err) return reply(_boom2['default'].unauthorized(responseErr.err.message));
          return reply(_boom2['default'].badImplementation('Error in assetAuthorized Handler', responseErr));
        });
        return promise;
      }
    };
  };

  this.assetsService = new _servicesAsset2['default']();
};

exports['default'] = AssetHandler;
module.exports = exports['default'];