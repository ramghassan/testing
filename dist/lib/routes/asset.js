'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _handlersAsset = require('../handlers/asset');

var _handlersAsset2 = _interopRequireDefault(_handlersAsset);

var assetHandler = new _handlersAsset2['default']();
var routes = [{ method: 'PUT', path: '/asset', config: assetHandler.put() }, { method: 'GET', path: '/asset', config: assetHandler.get() }, { method: 'PUT', path: '/asset/school', config: assetHandler.assetSchool() }, { method: 'GET', path: '/asset/school', config: assetHandler.getAssetSchool() }, { method: 'GET', path: '/asset/authorized', config: assetHandler.assetAuthorized() }];

exports.routes = routes;