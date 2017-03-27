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

var _delegatesAssetPulseasset = require('../../delegates/asset/pulseasset');

var _delegatesAssetPulseasset2 = _interopRequireDefault(_delegatesAssetPulseasset);

var _delegatesSchoolassetPulseschoolasset = require('../../delegates/schoolasset/pulseschoolasset');

var _delegatesSchoolassetPulseschoolasset2 = _interopRequireDefault(_delegatesSchoolassetPulseschoolasset);

var _delegatesSchoolPulseschool = require('../../delegates/school/pulseschool');

var _delegatesSchoolPulseschool2 = _interopRequireDefault(_delegatesSchoolPulseschool);

var _delegatesSchooluser = require('../../delegates/schooluser');

var _delegatesSchooluser2 = _interopRequireDefault(_delegatesSchooluser);

var _ServiceResponse = require('../ServiceResponse');

var _ServiceResponse2 = _interopRequireDefault(_ServiceResponse);

var _delegatesUser = require('../../delegates/user');

var _delegatesUser2 = _interopRequireDefault(_delegatesUser);

var _providersUserprovider = require('../../providers/userprovider');

var _providersUserprovider2 = _interopRequireDefault(_providersUserprovider);

var _utilsApputil = require('../../utils/apputil');

var _utilsApputil2 = _interopRequireDefault(_utilsApputil);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var AssetsService = function AssetsService() {
  var _this = this;

  _classCallCheck(this, AssetsService);

  this.get = function (ids) {
    return _this.assetsDelegate.get(ids);
  };

  this.getAssetSchool = function (ids, schoolIds) {
    return _this.assetsSchoolDelegate.get(ids, schoolIds);
  };

  this.put = function (payload) {
    var assetsPromise = _this.assetsDelegate.put(payload).then(function (response) {
      _logger2['default'].info('response put asset Service', JSON.stringify(response));
      return response;
    })['catch'](function (err) {
      _logger2['default'].info('error in creating asset Service', JSON.stringify(err));
      if (typeof err.message !== 'undefined') {
        _this.serviceErr.message = err.message;
        throw new _ServiceResponse2['default'](_this.serviceErr, '', null);
      }
      throw err;
    });
    return assetsPromise;
  };

  this.assetSchool = function (payload) {
    var assetsPromise = _this.schoolDelegate.isValidSchoolID(payload.schoolId).then(function (school) {
      if (!school) {
        _this.serviceErr.message = 'Invalid schoolId';
        throw new _ServiceResponse2['default'](_this.serviceErr, '', null);
      } else {
        _logger2['default'].info('response get assetSchool Service validate school', JSON.stringify(school));
        return _this.assetsDelegate.isValidAssetId(payload.assetId);
      }
    }).then(function (asset) {
      _logger2['default'].info(JSON.stringify(payload), 'response get assetSchool Service validate asset', JSON.stringify(asset));
      if (!asset) {
        _this.serviceErr.message = 'Invalid assetId';
        throw new _ServiceResponse2['default'](_this.serviceErr, '', null);
      } else {
        _logger2['default'].info('response get assetSchool Service validate asset', JSON.stringify(asset));
        return _this.assetsSchoolDelegate.put(payload);
      }
    })['catch'](function (err) {
      _logger2['default'].info('error in creating assetSchool Service', JSON.stringify(err));
      if (typeof err.message !== 'undefined') {
        _this.serviceErr.message = err.message;
        throw new _ServiceResponse2['default'](_this.serviceErr, '', null);
      }
      throw err;
    });
    return assetsPromise;
  };

  this.assetAuthorized = function (payload) {
    var assetId = undefined;
    var schoolIds = [];
    var pearsonAdmin = undefined;
    var assetsPromise = _this.userProvider.isValidtoken(payload.token).then(function (token) {
      if (token.valid) {
        _logger2['default'].info("Is token valid true....", token);
        if (_utilsApputil2['default'].isPearsonAdmin(payload.roleValue)) {
          pearsonAdmin = true;
          return true;
        }
        return _this.userDelegate.getUser(payload.userId);
      } else {
        _logger2['default'].info("Is token valid false....", token);
        _this.serviceErr.message = 'Token not valid';
        throw new _ServiceResponse2['default'](_this.serviceErr, '', null);
      }
    }).then(function (user) {
      if (user) {
        return _this.assetsDelegate.isValidAssetId(payload.assetId);
      } else {
        _this.serviceErr.message = 'User in not valid user';
        throw new _ServiceResponse2['default'](_this.serviceErr, '', null);
      }
    }).then(function (asset) {
      if (pearsonAdmin) {
        return true;
      }
      if (asset) {
        return _this.schoolUserDelegate.getSchoolsByUserID(payload.userId);
      } else {
        _this.serviceErr.message = 'AssetId is invalid';
        throw new _ServiceResponse2['default'](_this.serviceErr, '', null);
      }
    }).then(function (school) {
      if (pearsonAdmin) {
        return true;
      }
      if (school.length == 0) {
        _this.serviceErr.message = 'This user is not enrolled in any schools';
        throw new _ServiceResponse2['default'](_this.serviceErr, '', null);
      } else {
        _lodash2['default'].each(school, function (arg) {
          schoolIds.push(arg.schoolId);
        });
        _logger2['default'].info(schoolIds, ' response get assetSchool Service validate school ', JSON.stringify(school));
        return _this.assetsSchoolDelegate.getSchoolAssets(payload.assetId, schoolIds);
      }
    }).then(function (schoolasset) {
      if (pearsonAdmin) {
        return true;
      }
      _logger2['default'].info(' response Service validate asset school ', JSON.stringify(schoolasset));
      if (!schoolasset) {
        _this.serviceErr.message = 'The school, the user enrolled dont have the assetId';
        throw new _ServiceResponse2['default'](_this.serviceErr, '', null);
      } else {
        _logger2['default'].info(' response Service validate asset school ', JSON.stringify(schoolasset));
        return schoolasset;
      }
    })['catch'](function (err) {
      _logger2['default'].info('error in user authorization on asset Service', JSON.stringify(err));
      if (typeof err.message !== 'undefined') {
        _this.serviceErr.message = err.message;
        throw new _ServiceResponse2['default'](_this.serviceErr, '', null);
      }
      throw err;
    });
    return assetsPromise;
  };

  this.assetsDelegate = new _delegatesAssetPulseasset2['default']();
  this.assetsSchoolDelegate = new _delegatesSchoolassetPulseschoolasset2['default']();
  this.schoolDelegate = new _delegatesSchoolPulseschool2['default']();
  this.schoolUserDelegate = new _delegatesSchooluser2['default']();
  this.userDelegate = new _delegatesUser2['default']();
  this.userProvider = new _providersUserprovider2['default']();
  this.serviceErr = {};
};

exports['default'] = AssetsService;
module.exports = exports['default'];