'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _configuration = require('../../configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _httpAsPromised = require('http-as-promised');

var _httpAsPromised2 = _interopRequireDefault(_httpAsPromised);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _delegatesGeoPulsegeo = require('../../delegates/geo/pulsegeo');

var _delegatesGeoPulsegeo2 = _interopRequireDefault(_delegatesGeoPulsegeo);

var _ServiceResponse = require('../ServiceResponse');

var _ServiceResponse2 = _interopRequireDefault(_ServiceResponse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var GeoService = function GeoService() {
  var _this = this;

  _classCallCheck(this, GeoService);

  this.get = function (id) {
    var geoPromise = _this.geoDelegate.get(id).then(function (geoRes) {
      _lodash2['default'].each(geoRes, function (geo) {
        var links = geo.links.toObject();
        var linksKeys = Object.keys(links);
        if (linksKeys.length < 1) {
          delete geo.links;
        } else {
          for (var index in linksKeys) {
            if (!links[linksKeys[index]]) {
              delete links[linksKeys[index]];
            }
          }
        }
      });
      return geoRes;
    })['catch'](function (err) {
      _logger2['default'].info('error get schooladministration Service');
      throw err;
    });
    return geoPromise;
  };

  this.put = function (payload) {
    var serviceErr = {};
    var geoCreationPromise = _this.geoDelegate.put(payload).then(function (response) {
      _logger2['default'].info('response put Geo Service', JSON.stringify(response));
      return response;
    })['catch'](function (err) {
      _logger2['default'].info('error in creating Geo Service', JSON.stringify(err));
      if (typeof err.message !== 'undefined') {
        serviceErr.message = err.message;
        throw new _ServiceResponse2['default'](serviceErr, '', null);
      }
      throw err;
    });
    return geoCreationPromise;
  };

  this.geoDelegate = new _delegatesGeoPulsegeo2['default']();
};

exports['default'] = GeoService;
module.exports = exports['default'];