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

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var DBUtil = (function () {
  function DBUtil() {
    _classCallCheck(this, DBUtil);
  }

  _createClass(DBUtil, [{
    key: 'getPopulateQuery',
    value: function getPopulateQuery(query) {
      _logger2['default'].info('start get', { filename: __filename, pid: process.pid });
      var populateQuery = [];
      if (query) {
        var models = undefined;
        if (query.include.indexOf(',')) {
          models = query.include.split(',');
        } else {
          models = [];
          models[0] = query.include.trim();
        }
        for (var index in models) {
          var options = { path: models[index].trim() };
          populateQuery.push(options);
        }
      }
      return populateQuery;
    }
  }]);

  return DBUtil;
})();

var dbutil = new DBUtil();
exports['default'] = dbutil;
module.exports = exports['default'];