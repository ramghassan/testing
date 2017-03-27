'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _modelsAssets = require('../../models/assets');

var _modelsAssets2 = _interopRequireDefault(_modelsAssets);

var _modelsSchoolasset = require('../../models/schoolasset');

var _modelsSchoolasset2 = _interopRequireDefault(_modelsSchoolasset);

var AssetsSchoolDelegate = (function () {
  function AssetsSchoolDelegate() {
    _classCallCheck(this, AssetsSchoolDelegate);

    this.get = function (assetIds, schoolIds) {
      schoolIds = schoolIds && !(schoolIds instanceof Array) ? [schoolIds] : schoolIds;
      assetIds = assetIds && !(assetIds instanceof Array) ? [assetIds] : assetIds;
      var query = {};
      if (assetIds && schoolIds) {
        query = { assetId: { $in: assetIds }, schoolId: { $in: schoolIds } };
      } else if (assetIds) {
        query = { assetId: { $in: assetIds } };
      } else if (schoolIds) {
        query = { schoolId: { $in: schoolIds } };
      }
      var assetsPromise = _modelsSchoolasset2['default'].find(query).exec().then(function (asset) {
        if (asset) {
          _logger2['default'].info('Response get schoolasset delegate ', JSON.stringify(asset));
          return asset;
        } else {
          var err = { message: 'This asset is not enrolled with this school' };
          throw err;
        }
      })['catch'](function (err) {
        _logger2['default'].error('Error get asset delegate', JSON.stringify(err));
        throw err;
      });
      return assetsPromise;
    };

    this.put = function (body) {
      var query = { schoolId: body.schoolId, assetId: body.assetId };
      var assetsInstance = undefined;
      var assetsPromise = _modelsSchoolasset2['default'].findOne(query).exec().then(function (assets) {
        if (assets === null) {
          assetsInstance = new _modelsSchoolasset2['default'](body);
          _logger2['default'].info('Response put asset School delegate ', JSON.stringify(assetsInstance));
          return assetsInstance.save();
        } else {
          var err = { message: 'Provision of assets with same school already exists' };
          throw err;
        }
      })['catch'](function (err) {
        _logger2['default'].error('Error put asset School delegate', JSON.stringify(err));
        throw err;
      });
      return assetsPromise;
    };
  }

  _createClass(AssetsSchoolDelegate, [{
    key: 'getSchoolAssets',
    value: function getSchoolAssets(assetId, schoolIds) {
      return _modelsSchoolasset2['default'].findOne({ assetId: assetId, schoolId: { $in: schoolIds } });
    }
  }]);

  return AssetsSchoolDelegate;
})();

exports['default'] = AssetsSchoolDelegate;
module.exports = exports['default'];