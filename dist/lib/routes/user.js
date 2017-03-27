'use strict';

Object.defineProperty(exports, '__esModule', {
   value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _handlersUser = require('../handlers/user');

var _handlersUser2 = _interopRequireDefault(_handlersUser);

var userHandler = new _handlersUser2['default']();
var routes = [{ method: 'PUT', path: '/user', config: userHandler.put() }, { method: 'POST', path: '/user/authenticate', config: userHandler.login() }, { method: 'GET', path: '/user', config: userHandler.getUserProfile() }, { method: 'GET', path: '/user/schools', config: userHandler.getSchools() }, { method: 'GET', path: '/user/logout', config: userHandler.logout() }, { method: 'GET', path: '/user/isTokenValid', config: userHandler.isTokenValid() }];

exports.routes = routes;