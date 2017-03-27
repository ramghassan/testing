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

var _modelsSchooluser = require('../../models/schooluser');

var _modelsSchooluser2 = _interopRequireDefault(_modelsSchooluser);

var EnrollUserDelegate = function EnrollUserDelegate() {
  _classCallCheck(this, EnrollUserDelegate);

  this.get = function (geoname) {
    var query = { name: geoname };
    var enrollPromise = _modelsSchooluser2['default'].findOne(query).exec().then(function (user) {
      _logger2['default'].info('Response get enroll user delegate ', JSON.stringify(user));
      return user;
    })['catch'](function (err) {
      _logger2['default'].error('Error get enroll user delegate', JSON.stringify(err));
      throw err;
    });
    return enrollPromise;
  };

  this.put = function (body) {
    var query = { userId: body.userId, schoolId: body.schoolId };
    var enrollInstance = undefined;
    _logger2['default'].info('Response put enroll user delegate ', JSON.stringify(query));
    var enrollPromise = _modelsSchooluser2['default'].findOne(query).exec().then(function (user) {
      if (user === null) {
        enrollInstance = new _modelsSchooluser2['default'](body);
        _logger2['default'].info('Response put enroll user delegate ', JSON.stringify(enrollInstance));
        return enrollInstance.save();
      } else {
        var err = { message: 'User Already Enrolled' };
        throw err;
      }
    })['catch'](function (err) {
      _logger2['default'].error('Error put enroll user delegate', JSON.stringify(err));
      throw err;
    });
    return enrollPromise;
  };
};

exports['default'] = EnrollUserDelegate;
module.exports = exports['default'];