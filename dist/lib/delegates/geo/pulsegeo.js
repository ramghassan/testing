'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _utilsApputil = require('../../utils/apputil');

var _utilsApputil2 = _interopRequireDefault(_utilsApputil);

var _modelsGeo = require('../../models/geo');

var _modelsGeo2 = _interopRequireDefault(_modelsGeo);

var GeoDelegate = function GeoDelegate() {
  _classCallCheck(this, GeoDelegate);

  this.get = function (geoids) {
    var query = geoids ? { _id: { $in: geoids } } : '';
    var geoPromise = _modelsGeo2['default'].find(query).exec().then(function (geo) {
      _logger2['default'].info('Response get geo delegate ', JSON.stringify(geo));
      return geo;
    })['catch'](function (err) {
      _logger2['default'].error('Error get geo delegate', JSON.stringify(err));
      throw err;
    });
    return geoPromise;
  };

  this.put = function (body) {
    var query = { name: body.name };
    var geoInstance = undefined;
    var geoPromise = _modelsGeo2['default'].findOne(query).exec().then(function (geo) {
      if (geo === null) {
        geoInstance = new _modelsGeo2['default'](body);
        _logger2['default'].info('Response put geo delegate ', JSON.stringify(geoInstance));
        return geoInstance.save();
      } else {
        var err = { message: 'Geo name already exists' };
        throw err;
      }
    })['catch'](function (err) {
      _logger2['default'].error('Error put geo delegate', JSON.stringify(err));
      throw err;
    });
    return geoPromise;
  };
};

exports['default'] = GeoDelegate;
module.exports = exports['default'];