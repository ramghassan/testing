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

var _modelsSchooladministration = require('../../models/schooladministration');

var _modelsSchooladministration2 = _interopRequireDefault(_modelsSchooladministration);

var SADelegate = function SADelegate() {
  _classCallCheck(this, SADelegate);

  this.get = function (ids, geoId) {
    var query = {};
    if (ids && geoId) {
      query = { geoId: geoId, _id: { $in: ids } };
    } else if (geoId) {
      query = { geoId: geoId };
    } else {
      query = ids ? { _id: { $in: ids } } : '';
    }
    var saPromise = _modelsSchooladministration2['default'].find(query).exec().then(function (sa) {
      _logger2['default'].info('Response get SA delegate ', JSON.stringify(sa));
      return sa;
    })['catch'](function (err) {
      _logger2['default'].error('Error get SA delegate', JSON.stringify(err));
      throw err;
    });
    return saPromise;
  };

  this.put = function (body) {
    var query = { name: body.name, geoId: body.geoId };
    var saInstance = undefined;
    var saPromise = _modelsSchooladministration2['default'].findOne(query).exec().then(function (sa) {
      if (sa === null) {
        saInstance = new _modelsSchooladministration2['default'](body);
        _logger2['default'].info('Response put SA delegate ', JSON.stringify(saInstance));
        return saInstance.save();
      } else {
        var err = { message: 'Schoolsadministration name already created with same geoId' };
        throw err;
      }
    })['catch'](function (err) {
      _logger2['default'].error('Error put sa delegate', JSON.stringify(err));
      throw err;
    });
    return saPromise;
  };
};

exports['default'] = SADelegate;
module.exports = exports['default'];