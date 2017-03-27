'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _handlersSchool = require('../handlers/school');

var _handlersSchool2 = _interopRequireDefault(_handlersSchool);

var schoolHandler = new _handlersSchool2['default']();
var routes = [{ method: 'PUT', path: '/school', config: schoolHandler.put() }, { method: 'PUT', path: '/school/enrolluser', config: schoolHandler.enrollUser() }, { method: 'GET', path: '/school', config: schoolHandler.getSchools() }];

exports.routes = routes;