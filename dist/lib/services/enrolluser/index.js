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

var _delegatesEnrolluserPulseenrolluser = require('../../delegates/enrolluser/pulseenrolluser');

var _delegatesEnrolluserPulseenrolluser2 = _interopRequireDefault(_delegatesEnrolluserPulseenrolluser);

var _delegatesUser = require('../../delegates/user');

var _delegatesUser2 = _interopRequireDefault(_delegatesUser);

var _delegatesSchoolPulseschool = require('../../delegates/school/pulseschool');

var _delegatesSchoolPulseschool2 = _interopRequireDefault(_delegatesSchoolPulseschool);

var _ServiceResponse = require('../ServiceResponse');

var _ServiceResponse2 = _interopRequireDefault(_ServiceResponse);

var EnrollUserService = function EnrollUserService() {
  var _this = this;

  _classCallCheck(this, EnrollUserService);

  this.get = function (params) {
    return _this.enrollUserDelegate.get(params);
  };

  this.put = function (payload) {
    var serviceErr = {};
    var enrollCreationPromise = _this.userDelegate.getUserByuid(payload.userId).then(function (userRes) {
      console.log("payload.uid  " + payload.userId + "    " + JSON.stringify(userRes) + payload.schoolId);
      if (!userRes) {
        serviceErr.message = 'Invalid uid';
        throw new _ServiceResponse2['default'](serviceErr, '', null);
      } else {
        _logger2['default'].info('response put enroll user Service valid user', JSON.stringify(userRes.email));
        return _this.schoolDelegate.isValidSchoolID(payload.schoolId);
      }
    }).then(function (schoolRes) {
      console.log("payload.SchoolId  " + payload.schoolId + "    " + JSON.stringify(schoolRes));
      if (!schoolRes) {
        serviceErr.message = 'Invalid school id';
        throw new _ServiceResponse2['default'](serviceErr, '', null);
      } else {
        _logger2['default'].info('response put enroll user Service valid school', JSON.stringify(schoolRes.name));
        return _this.enrollUserDelegate.put(payload);
      }
    })['catch'](function (err) {
      _logger2['default'].info('error in creating enroll user Service', JSON.stringify(err));

      if (typeof err.message !== 'undefined') {
        serviceErr.message = err.message;
        throw new _ServiceResponse2['default'](serviceErr, '', null);
      }
      throw err;
    });
    return enrollCreationPromise;
  };

  this.enrollUserDelegate = new _delegatesEnrolluserPulseenrolluser2['default']();
  this.userDelegate = new _delegatesUser2['default']();
  this.schoolDelegate = new _delegatesSchoolPulseschool2['default']();
};

exports['default'] = EnrollUserService;
module.exports = exports['default'];