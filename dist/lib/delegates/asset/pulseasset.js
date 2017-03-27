'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _modelsAssets = require('../../models/assets');

var _modelsAssets2 = _interopRequireDefault(_modelsAssets);

var AssetsDelegate = function AssetsDelegate() {
  _classCallCheck(this, AssetsDelegate);

  this.get = function (assetIds) {
    var query = assetIds ? { _id: { $in: assetIds } } : '';
    var assetsPromise = _modelsAssets2['default'].find(query).exec().then(function (asset) {
      if (asset) {
        _logger2['default'].info('Response get asset delegate ', JSON.stringify(asset));
        return asset;
      } else {
        var err = { message: 'Invalid assetsId' };
        throw err;
      }
    })['catch'](function (err) {
      _logger2['default'].error('Error get asset delegate', JSON.stringify(err));
      throw err;
    });
    return assetsPromise;
  };

  this.put = function (body) {
    var query = { "lookUp.originId": body.lookUp.originId };
    console.log("body" + JSON.stringify(body));
    var assetsInstance = undefined;
    var assetsPromise = _modelsAssets2['default'].findOne(query).exec().then(function (assets) {
      if (assets === null) {
        assetsInstance = new _modelsAssets2['default'](body);
        _logger2['default'].info('Response put assets section delegate ', JSON.stringify(assetsInstance));
        return assetsInstance.save();
      } else {
        var err = { message: 'Assets with same originId already exists' };
        throw err;
      }
    })['catch'](function (err) {
      _logger2['default'].error('Error put assets section delegate', JSON.stringify(err));
      throw err;
    });
    return assetsPromise;
  };

  this.assetSchool = function (body) {
    var query = { schoolId: body.schoolId, assetId: body.assetId };
    console.log("body" + JSON.stringify(body));
    var assetsSchoolInstance = undefined;
    var assetsPromise = _modelsAssets2['default'].findOne(query).exec().then(function (assets) {
      if (assets === null) {
        assetsSchoolInstance = new _modelsAssets2['default'](body);
        _logger2['default'].info('Response put asset School delegate ', JSON.stringify(assetsSchoolInstance));
        return assetsSchoolInstance.save();
      } else {
        var err = { message: 'Provision of assets with same school already Exists' };
        throw err;
      }
    })['catch'](function (err) {
      _logger2['default'].error('Error put asset School delegate', JSON.stringify(err));
      throw err;
    });
    return assetsPromise;
  };

  this.isValidAssetId = function (assetId) {
    var query = { "_id": assetId };
    var assetsPromise = _modelsAssets2['default'].findOne(query).exec().then(function (asset) {
      if (asset) {
        _logger2['default'].info('Response get asset delegate ', JSON.stringify(asset));
        return asset;
      } else {
        var err = { message: 'Invalid assetsId' };
        throw err;
      }
    })['catch'](function (err) {
      _logger2['default'].error('Error get asset delegate', JSON.stringify(err));
      throw err;
    });
    return assetsPromise;
  };
};

exports['default'] = AssetsDelegate;
module.exports = exports['default'];