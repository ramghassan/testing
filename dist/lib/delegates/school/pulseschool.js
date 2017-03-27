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

var _modelsSchool = require('../../models/school');

var _modelsSchool2 = _interopRequireDefault(_modelsSchool);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var SchoolDelegate = function SchoolDelegate() {
  _classCallCheck(this, SchoolDelegate);

  this.getSchools = function (geoIds, saIds, schoolIds) {
    var promise = undefined;

    geoIds = geoIds && !(geoIds instanceof Array) ? [geoIds] : geoIds;
    saIds = saIds && !(saIds instanceof Array) ? [saIds] : saIds;

    console.log("geoIds and saIds and schoolIds are ", geoIds, saIds, schoolIds);
    var options = { path: 'saId', select: '_id', match: { geoId: { $in: [geoIds] } } };

    if (geoIds && saIds && schoolIds) {
      promise = _modelsSchool2['default'].find({ saId: { $in: saIds }, _id: { $in: schoolIds } }).populate(options).exec();
    } else if (geoIds && saIds) {
      promise = _modelsSchool2['default'].find({ saId: { $in: saIds } }).populate(options).exec();
    } else if (geoIds && schoolIds) {
      promise = _modelsSchool2['default'].find({ _id: { $in: schoolIds } }).populate(options).exec();
    } else if (saIds && schoolIds) {
      promise = _modelsSchool2['default'].find({ saId: { $in: saIds }, _id: { $in: schoolIds } }).exec();
    } else if (geoIds) {
      promise = _modelsSchool2['default'].find({}).populate(options).exec();
    } else if (saIds) {
      promise = _modelsSchool2['default'].find({ saId: { $in: saIds } }).exec();
    } else if (schoolIds) {
      promise = _modelsSchool2['default'].find({ _id: { $in: schoolIds } }).exec();
    } else {
      promise = _modelsSchool2['default'].find({}).exec();
    }
    return promise.then(function (schools) {
      return _lodash2['default'].compact(_lodash2['default'].map(schools, function (school) {
        console.log("Before remove null saIds from schools is ", school);
        if (school.saId) {
          school.saId = school.saId._id || school.saId;
          return school;
        } else return null;
      }));
    })['catch'](function (err) {
      _logger2['default'].error('error getSchools', { filename: __filename, pid: process.pid, error: err.toString() });
      throw err;
    });
  };

  this.get = function (schoolid) {
    var query = { _id: schoolid };
    var schoolPromise = _modelsSchool2['default'].findOne(query).exec().then(function (school) {
      _logger2['default'].info('Response get school delegate ', JSON.stringify(school));
      return school;
    })['catch'](function (err) {
      _logger2['default'].error('Error get school delegate', JSON.stringify(err));
      throw err;
    });
    return schoolPromise;
  };

  this.put = function (body) {
    var query = { name: body.name, saId: body.saId };
    var schoolInstance = undefined;
    var schoolPromise = _modelsSchool2['default'].findOne(query).exec().then(function (school) {
      if (school === null) {
        schoolInstance = new _modelsSchool2['default'](body);
        _logger2['default'].info('Response put school delegate ', JSON.stringify(schoolInstance));
        return schoolInstance.save();
      } else {
        var err = { message: 'Schools name already created with same saId' };
        throw err;
      }
    })['catch'](function (err) {
      _logger2['default'].error('Error put school delegate', JSON.stringify(err));
      throw err;
    });
    return schoolPromise;
  };

  this.isValidSchoolID = function (id) {
    return _modelsSchool2['default'].findOne({ _id: id }).exec();
  };
};

exports['default'] = SchoolDelegate;
module.exports = exports['default'];