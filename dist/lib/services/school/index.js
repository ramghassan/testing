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

var _delegatesSchoolPulseschool = require('../../delegates/school/pulseschool');

var _delegatesSchoolPulseschool2 = _interopRequireDefault(_delegatesSchoolPulseschool);

var _delegatesSchooluser = require('../../delegates/schooluser');

var _delegatesSchooluser2 = _interopRequireDefault(_delegatesSchooluser);

var _delegatesUser = require('../../delegates/user');

var _delegatesUser2 = _interopRequireDefault(_delegatesUser);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ServiceResponse = require('../ServiceResponse');

var _ServiceResponse2 = _interopRequireDefault(_ServiceResponse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var SchoolService = function SchoolService() {
  var _this = this;

  _classCallCheck(this, SchoolService);

  this.get = function (params) {
    return _this.schoolDelegate.get(params);
  };

  this.put = function (body) {
    var serviceErr = {};
    var schoolPromise = _this.schoolAdminDelegate.get(body.saId).then(function (sa) {
      _logger2['default'].info('response put school Service', JSON.stringify(sa));
      if (!sa || sa.length == 0) {
        serviceErr.message = 'Invalid schoolsadministration id';
        throw new _ServiceResponse2['default'](serviceErr, '', null);
      } else {
        return _this.schoolDelegate.put(body);
      }
    })['catch'](function (err) {
      _logger2['default'].info('error in creating school Service' + JSON.stringify(err));
      if (typeof err.message !== 'undefined') {
        serviceErr.message = err.message;
        throw new _ServiceResponse2['default'](serviceErr, '', null);
      }
      throw err;
    });
    return schoolPromise;
  };

  this.getSchools = function (geoId, saId, ids, userId, isPearsonAdmin) {
    var promise = undefined;
    if (isPearsonAdmin) {
      promise = _this.schoolDelegate.getSchools(geoId, saId, ids);
    } else {
      promise = _this.schoolUserDelegate.getSchools(userId, ids);
    }
    return promise.then(function (schoolsWithOwnLinks) {
      return _this.overrideSchoolLinks(schoolsWithOwnLinks);
    })['catch'](function (err) {
      _logger2['default'].error('error getSchools', { filename: __filename, pid: process.pid, error: err.toString() });
      throw err;
    });
  };

  this.overrideSchoolLinks = function (schools) {
    schools = !schools ? [] : !(schools instanceof Array) ? [schools] : schools;

    return _bluebird2['default'].all(_lodash2['default'].map(schools, function (school) {
      var promise = _this.userDelegate.getLinks(school.links, school.saId).then(function (links) {
        if (links !== null) {
          school.links = links;
        }
        return school;
      })['catch'](function (err) {
        _logger2['default'].error('error overrideSchoolLinks', { filename: __filename, pid: process.pid, error: err.toString() });
        throw err;
      });
      return promise;
    }));
  };

  this.schoolDelegate = new _delegatesSchoolPulseschool2['default']();
  this.schoolUserDelegate = new _delegatesSchooluser2['default']();
  this.userDelegate = new _delegatesUser2['default']();
  this.schoolAdminDelegate = new _delegatesSchooladministrationPulseschooladmin2['default']();
};

exports['default'] = SchoolService;
module.exports = exports['default'];