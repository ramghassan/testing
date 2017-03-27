'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _servicesUser = require('../services/user');

var _servicesUser2 = _interopRequireDefault(_servicesUser);

var _utilsJsonapimapper = require('../utils/jsonapimapper');

var _utilsJsonapimapper2 = _interopRequireDefault(_utilsJsonapimapper);

var _httpAsPromised = require('http-as-promised');

var _httpAsPromised2 = _interopRequireDefault(_httpAsPromised);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _utilsApputil = require('../utils/apputil');

var _utilsApputil2 = _interopRequireDefault(_utilsApputil);

var _utilsCacheutil = require('../utils/cacheutil');

var _utilsCacheutil2 = _interopRequireDefault(_utilsCacheutil);

var _thirdpartyForgerock = require('../thirdparty/forgerock');

var _thirdpartyForgerock2 = _interopRequireDefault(_thirdpartyForgerock);

var _servicesUsersession = require('../services/usersession');

var _servicesUsersession2 = _interopRequireDefault(_servicesUsersession);

var UserHandler = (function () {
  function UserHandler() {
    var _this = this;

    _classCallCheck(this, UserHandler);

    this.put = function () {
      return {
        tags: ['api'],
        auth: 'bearer',
        description: 'Create user',
        notes: ['Only user with role pearson admin can create the user'],
        validate: {
          payload: _joi2['default'].object({
            user: _joi2['default'].array().items({
              name: _joi2['default'].string().trim().required(),
              username: _joi2['default'].string().trim().required(),
              password: _joi2['default'].string().trim().required(),
              email: _joi2['default'].string().trim().required().description('User email used for login').example('xyz@anymail.com'),
              fName: _joi2['default'].string().trim().required(),
              lName: _joi2['default'].string().trim().required(),
              thumbnail: _joi2['default'].string().trim().allow('')
            })
          })
        },
        handler: function handler(request, reply) {
          var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
            if (!_utilsApputil2['default'].isPearsonAdmin(userSession.roleValue)) {
              return reply(_boom2['default'].methodNotAllowed('User is not pearson admin'));
            }
            var payload = _utilsJsonapimapper2['default'].serialize('user', request.payload);
            var userPromise = _this.forgeRockService.createUser(payload).then(function (response) {
              if (response.err) return reply(response.err);else {
                payload.uid = response.data.username;
                payload.username = response.data.username;
                return _this.userService.put(payload);
              }
            }).then(function (response) {
              if (!response.err) return reply(response);
            })['catch'](function (err) {
              if (!err) return reply(_boom2['default'].badImplementation('Error inserting user', err));
            });
          });
        }
      };
    };

    this.getUserProfile = function () {
      return {
        tags: ['api'],
        auth: 'bearer',
        description: 'Get my profile',
        validate: {
          query: {
            id: _joi2['default'].string().trim().allow('')
          }
        },
        handler: function handler(request, reply) {
          var userSession = undefined;
          var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (session) {
            userSession = session;
            if (!userSession.userId) {
              return _boom2['default'].badImplementation('Error fetching userId');
            }
            return _this.userService.getProfile(userSession.userId);
          }).then(function (userProfile) {
            if (request.query.id) {
              if (userProfile && _utilsApputil2['default'].isPearsonAdmin(userSession.roleValue) || _utilsApputil2['default'].isRoleTeacherInSchool(userProfile)) {
                request.query.id = request.query.id.replace(/\s/g, '').split(',');
                console.log("request.query.id", request.query.id);
                return _this.userService.getUsersProfile(request.query.id);
              } else {
                return _boom2['default'].methodNotAllowed('User is not pearsonAdmin or teacher');
              }
            } else {
              return _this.userService.getProfile(userSession.userId);
            }
          }).then(function (response) {
            console.log("user profile response is :::::::::::", response);
            return reply(response);
          })['catch'](function (err) {
            return reply(_boom2['default'].badImplementation('Error fetching user profile', err));
          });
        }
      };
    };

    this.getSchools = function () {
      return {
        tags: ['api'],
        auth: 'bearer',
        description: 'Get my schools',
        notes: ['Get schools of the logged-in user'],
        handler: function handler(request, reply) {
          _logger2['default'].info('Start get school for user handler ', { filename: __filename, pid: process.pid });
          var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
            return _this.userService.getSchools(userSession.userId);
          }).then(function (response) {
            _logger2['default'].info("Response get school for user handler", JSON.stringify(response));
            return reply(response);
          })['catch'](function (err) {
            _logger2['default'].error('Error get school for user handler ...' + JSON.stringify(err));
            return reply(_boom2['default'].badImplementation('Error getting school', err));
          });
        }
      };
    };

    this.login = function () {
      return {
        tags: ['api'],
        description: 'Login',
        notes: ['API for logging in using username & password'],
        validate: {
          payload: {
            username: _joi2['default'].string().trim().required().description('the Username field cannot be empty'),
            password: _joi2['default'].string().trim().required().description('the Password field cannot be empty')
          }
        },
        handler: function handler(request, reply) {
          _logger2['default'].info('start login', { filename: __filename, pid: process.pid });
          var promise = _this.forgeRockService.login(request.payload).then(function (result) {
            return _this.userSessionService.createSession(request.server, result.tokenId, request.headers, request.payload.username);
          }).then(function (userSession) {
            return reply({ access_token: userSession.token || '' });
          })['catch'](function (err) {
            _logger2['default'].error('error login', { filename: __filename, pid: process.pid, error: err.toString() });
            return reply(_boom2['default'].badRequest("Error Authenticating User"));
          });
        }
      };
    };

    this.userService = new _servicesUser2['default']();
    this.forgeRockService = new _thirdpartyForgerock2['default']();
    this.userSessionService = new _servicesUsersession2['default']();
  }

  _createClass(UserHandler, [{
    key: 'logout',
    value: function logout() {
      var _this2 = this;

      return {
        auth: 'bearer',
        tags: ['api'],
        description: 'Logout',
        notes: ['API for logging out user with a valid token set in the request header (Authorization: Bearer tokenXXXX)'],
        handler: function handler(request, reply) {
          var token = request.headers.authorization.split(' ')[1];
          var promise = _this2.userSessionService.removeSession(token).then(function (result) {
            return _utilsCacheutil2['default'].dropSessionFromCache(request.server, token);
          }).then(function (result) {
            if (result) return _this2.forgeRockService.logout(token);
          }).then(function (response) {
            return reply('success');
          })['catch'](function (err) {
            _logger2['default'].error('error logout', { filename: __filename, pid: process.pid, error: err.toString() });
            return reply(_boom2['default'].badRequest("Error in logout"));
          });
        }
      };
    }
  }, {
    key: 'isTokenValid',
    value: function isTokenValid() {
      var _this3 = this;

      return {
        auth: 'bearer',
        tags: ['api'],
        description: 'validate forgerock token',
        notes: ['API for a valid token set in the request header (Authorization: Bearer tokenXXXX)'],
        validate: {
          query: {
            id: _joi2['default'].string().required()
          }
        },
        handler: function handler(request, reply) {
          var token = request.headers.authorization.split(' ')[1];
          _logger2['default'].info('Start isTokenValid ', { filename: __filename, pid: process.pid });
          var promise = _utilsCacheutil2['default'].getSessionFromCache(request.server, request.headers.authorization.split(' ')[1]).then(function (userSession) {
            if (userSession.userId === request.query.id) {
              _this3.forgeRockService.isTokenValid(token).then(function (result) {
                return reply(result.valid);
              });
            } else {
              return reply(_boom2['default'].methodNotAllowed('Invalid id'));
            }
          })['catch'](function (err) {
            _logger2['default'].error('error in validate token', { filename: __filename, pid: process.pid, error: err.toString() });
            return reply(_boom2['default'].badRequest("Error in validate token"));
          });
        }
      };
    }
  }]);

  return UserHandler;
})();

exports['default'] = UserHandler;
module.exports = exports['default'];