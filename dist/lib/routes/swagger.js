'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _handlersSwagger = require('../handlers/swagger');

var _handlersSwagger2 = _interopRequireDefault(_handlersSwagger);

var swaggerHandler = new _handlersSwagger2['default']();
module.exports.routes = [{ method: 'GET', path: '/', config: swaggerHandler.index() }];