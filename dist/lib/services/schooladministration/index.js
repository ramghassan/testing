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

var _delegatesSchooladministrationPulseschooladmin = require('../../delegates/schooladministration/pulseschooladmin');

var _delegatesSchooladministrationPulseschooladmin2 = _interopRequireDefault(_delegatesSchooladministrationPulseschooladmin);

var _delegatesGeoPulsegeo = require('../../delegates/geo/pulsegeo');

var _delegatesGeoPulsegeo2 = _interopRequireDefault(_delegatesGeoPulsegeo);

var _ServiceResponse = require('../ServiceResponse');

var _ServiceResponse2 = _interopRequireDefault(_ServiceResponse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var SchoolAdminService = function SchoolAdminService() {
  var _this = this;

  _classCallCheck(this, SchoolAdminService);

  this.get = function (id, geoId) {
    var saPromise = _this.schoolAdminDelegate.get(id, geoId).then(function (saRes) {
      _lodash2['default'].each(saRes, function (sa) {
        var links = sa.links.toObject();
        var linksKeys = Object.keys(links);
        if (linksKeys.length < 1) {
          delete sa.links;
        } else {
          for (var index in linksKeys) {
            if (!links[linksKeys[index]]) {
              delete links[linksKeys[index]];
            }
          }
        }
      });
      return saRes;
    })['catch'](function (err) {
      _logger2['default'].info('error get schooladministration Service');
      throw err;
    });
    return saPromise;
  };

  this.put = function (body) {
    var serviceErr = {};
    var schoolAdminPromise = _this.geoDelegate.get(body.geoId).then(function (geo) {
      _logger2['default'].info('response put schooladministration Service', JSON.stringify(geo));
      if (!geo || geo.length == 0) {
        console.log('===========response put schooladministration Service', JSON.stringify(geo));
        serviceErr.message = 'Invalid geoid';
        throw new _ServiceResponse2['default'](serviceErr, '', null);
      } else {
        return _this.schoolAdminDelegate.put(body);
      }
    })['catch'](function (err) {
      _logger2['default'].info('error in creating schooladministration Service' + JSON.stringify(err));
      if (typeof err.message !== 'undefined') {
        serviceErr.message = err.message;
        throw new _ServiceResponse2['default'](serviceErr, '', null);
      }
      throw err;
    });
    return schoolAdminPromise;
  };

  this.schoolAdminDelegate = new _delegatesSchooladministrationPulseschooladmin2['default']();
  this.geoDelegate = new _delegatesGeoPulsegeo2['default']();
};

exports['default'] = SchoolAdminService;
module.exports = exports['default'];