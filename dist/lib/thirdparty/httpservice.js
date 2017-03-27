'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _configuration = require('../configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _httpAsPromised = require('http-as-promised');

var _httpAsPromised2 = _interopRequireDefault(_httpAsPromised);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var HttpService = function HttpService() {
  _classCallCheck(this, HttpService);

  this.postService = function (url, headers, data, json) {
    var deferred = _bluebird2['default'].pending();
    var request = (0, _httpAsPromised2['default'])(url, {
      method: 'POST',
      resolve: ['body', 'response'],
      headers: headers,
      data: data,
      json: {
        'username': json.username,
        'userpassword': json.password,
        'mail': json.email
      }
    });
    request.nodeify(function (err, rawResponse) {
      if (err) {
        _logger2['default'].info('HttpService Foregerock Err', err);
        deferred.reject(err);
      } else {
        var response = rawResponse ? rawResponse : rawResponse;
        _logger2['default'].info('HttpService Foregerock Response', response);
        deferred.resolve(response);
      }
    }, { spread: true });
    return deferred.promise;
  };
};

exports['default'] = HttpService;
module.exports = exports['default'];