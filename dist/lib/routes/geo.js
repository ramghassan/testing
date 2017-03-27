'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _handlersGeo = require('../handlers/geo');

var _handlersGeo2 = _interopRequireDefault(_handlersGeo);

var geohandler = new _handlersGeo2['default']();
var routes = [{ method: 'PUT', path: '/geo', config: geohandler.put() }, { method: 'GET', path: '/geo', config: geohandler.get() }];

exports.routes = routes;