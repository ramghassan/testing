'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var CacheUtil = function CacheUtil() {
  var _this = this;

  _classCallCheck(this, CacheUtil);

  this.dropSessionFromCache = function (server, token) {
    var deferred = _bluebird2['default'].pending();
    server.methods.isAuthenticatedUser.cache.drop(token, function (err, resp) {
      if (err) {
        deferred.reject("Unable to drop userSession object from cache for the token " + token + " " + err);
      }
      deferred.resolve(true);
    });
    return deferred.promise;
  };

  this.addSessionToCache = function (server, userSession, roleValue) {
    var deferred = _bluebird2['default'].pending();
    if (!userSession) {
      deferred.reject("Unable to update cache - userSession object is null or undefined: " + userSession);
    }
    var userSessionData = _this.getTrimmedUserSession(userSession, roleValue);
    server.methods.isAuthenticatedUser(userSessionData.token || '', userSessionData, function (err, resp) {
      if (err) {
        deferred.reject("Unable to update cache for the userSession object  " + err);
      }
      deferred.resolve(resp);
    });
    return deferred.promise;
  };

  this.getSessionFromCache = function (server, token) {
    var deferred = _bluebird2['default'].pending();
    server.methods.isAuthenticatedUser(token, null, function (err, resp) {
      if (err) {
        deferred.reject("Unable to get the userSession object  " + err);
      }
      deferred.resolve(resp);
    });
    return deferred.promise;
  };

  this.getTrimmedUserSession = function (userSession, roleValue) {
    console.log('get getTrimmedUserSession' + JSON.stringify(userSession));
    return {
      userId: userSession.userId,
      deviceId: userSession.deviceId,
      token: userSession.token,
      startTime: userSession.startTime,
      userAgent: userSession.userAgent,
      language: userSession.language,
      roleValue: roleValue
    };
  };
};

var cacheUtil = new CacheUtil();
exports['default'] = cacheUtil;
module.exports = exports['default'];