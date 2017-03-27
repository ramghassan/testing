'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _utilsMarkdown = require('../utils/markdown');

var _utilsMarkdown2 = _interopRequireDefault(_utilsMarkdown);

var SwaggerHandler = (function () {
  function SwaggerHandler() {
    _classCallCheck(this, SwaggerHandler);
  }

  _createClass(SwaggerHandler, [{
    key: 'index',
    value: function index() {
      return {
        handler: function handler(request, reply) {
          var markDown = new _utilsMarkdown2['default']();
          markDown.getMarkDownHTML(__dirname.replace('/lib/handlers', '') + '/README.md', function (err, data) {
            reply.view('swagger.html', {
              title: 'Pulse-API',
              markdown: data
            });
          });
        }
      };
    }
  }]);

  return SwaggerHandler;
})();

exports['default'] = SwaggerHandler;
module.exports = exports['default'];