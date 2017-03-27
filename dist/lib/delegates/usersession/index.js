'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _modelsUsersession = require('../../models/usersession');

var _modelsUsersession2 = _interopRequireDefault(_modelsUsersession);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _utilsCacheutil = require('../../utils/cacheutil');

var _utilsCacheutil2 = _interopRequireDefault(_utilsCacheutil);

var UserSessionDelegate = function UserSessionDelegate() {
  _classCallCheck(this, UserSessionDelegate);

  this.createSession = function (server, token, headers, user) {
    var query = {
      userId: user.uid,
      deviceId: headers.deviceid,
      userAgent: headers['user-agent'],
      token: token,
      language: headers['accept-language']
    };
    var updateData = _lodash2['default'].clone(query, true);
    updateData.startTime = new Date().toISOString();
    var userSessionPromise = _modelsUsersession2['default'].findOneAndUpdate(query, updateData, { upsert: true, 'new': true }).then(function (userSession) {
      return _utilsCacheutil2['default'].addSessionToCache(server, userSession, user.roleValue);
    })['catch'](function (err) {
      _logger2['default'].error('error createSession', { filename: __filename, pid: process.pid, error: err.toString() });
      throw err;
    });
    return userSessionPromise;
  };

  this.removeSession = function (token) {
    return _modelsUsersession2['default'].remove({ token: token }).exec();
  };
};

exports['default'] = UserSessionDelegate;
module.exports = exports['default'];