'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var MarkDown = (function () {
  function MarkDown() {
    _classCallCheck(this, MarkDown);
  }

  _createClass(MarkDown, [{
    key: 'getMarkDownHTML',
    value: function getMarkDownHTML(path, callback) {
      _fs2['default'].readFile(path, 'utf8', function (err, data) {
        if (!err) {
          marked.setOptions({
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            langPrefix: 'language-',
            highlight: function highlight(code, lang) {
              return code;
            }
          });
          data = marked(data);
        }
        callback(err, data);
      });
    }
  }]);

  return MarkDown;
})();

exports['default'] = MarkDown;
module.exports = exports['default'];