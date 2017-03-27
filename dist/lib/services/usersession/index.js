'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _delegatesUser = require('../../delegates/user');

var _delegatesUser2 = _interopRequireDefault(_delegatesUser);

var _delegatesUsersession = require('../../delegates/usersession');

var _delegatesUsersession2 = _interopRequireDefault(_delegatesUsersession);

var UserSessionService = function UserSessionService() {
  var _this = this;

  _classCallCheck(this, UserSessionService);

  this.createSession = function (server, token, headers, uid) {
    var promise = _this.userDelegate.getUserByuid(uid).then(function (user) {
      if (!user) {
        throw new Error("user with email " + uid + " does not exist in database");
      }
      return _this.userSessionDelegate.createSession(server, token, headers, user);
    })['catch'](function (err) {
      _logger2['default'].error('error createSession', { filename: __filename, pid: process.pid, error: err.toString() });
      throw err;
    });
    return promise;
  };

  this.removeSession = function (token) {
    var promise = _this.userSessionDelegate.removeSession(token).then(function (response) {
      if (!response) {
        throw new Error("Error in removing user session");
      }
      return response;
    })['catch'](function (err) {
      _logger2['default'].error('error removeSession', { filename: __filename, pid: process.pid, error: err.toString() });
      throw err;
    });
    return promise;
  };

  this.userSessionDelegate = new _delegatesUsersession2['default']();
  this.userDelegate = new _delegatesUser2['default']();
};

exports['default'] = UserSessionService;
module.exports = exports['default'];