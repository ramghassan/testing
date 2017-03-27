'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _handlersSchooladministration = require('../handlers/schooladministration');

var _handlersSchooladministration2 = _interopRequireDefault(_handlersSchooladministration);

var schoolAdminHandler = new _handlersSchooladministration2['default']();
var routes = [{ method: 'PUT', path: '/schoolsadministration', config: schoolAdminHandler.put() }, { method: 'GET', path: '/schoolsadministration', config: schoolAdminHandler.get() }];

exports.routes = routes;