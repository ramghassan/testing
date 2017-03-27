'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _goodConsole = require('good-console');

var _goodConsole2 = _interopRequireDefault(_goodConsole);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

exports['default'] = {
  tokenType: 'Bearer',
  validateFunc: function validateFunc(token, callback) {
    var request = this;
    var headers = request.raw.req.headers;
    _logger2['default'].info("Inside validateFunc - token is : " + token);
    request.server.methods.isAuthenticatedUser(token, null, function (err, resp) {
      console.error('error ' + err + ' resp ' + resp);
      var isAuthenticated = false;
      if (resp) isAuthenticated = true;
      console.info('isAuthenticated ' + isAuthenticated);
      callback(null, isAuthenticated, { token: token });
    });
  }
};
module.exports = exports['default'];