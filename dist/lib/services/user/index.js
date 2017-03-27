'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _delegatesUser = require('../../delegates/user');

var _delegatesUser2 = _interopRequireDefault(_delegatesUser);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilsApputil = require('../../utils/apputil');

var _utilsApputil2 = _interopRequireDefault(_utilsApputil);

var UserService = function UserService() {
  var _this = this;

  _classCallCheck(this, UserService);

  this.getUserRole = function (email) {
    return _this.userDelegate.getUserRole(email);
  };

  this.put = function (payload) {
    var userCreationPromise = _this.userDelegate.put(payload).then(function (response) {
      return response;
    })['catch'](function (err) {
      _logger2['default'].error('error user service' + JSON.stringify(err));
      throw err;
    });
    return userCreationPromise;
  };

  this.getProfile = function (uid) {
    _logger2['default'].info('In User getProfile Service', uid);
    var userPromise = _this.userDelegate.isUserEnrolled(uid).then(function (response) {
      _logger2['default'].info('In User getProfile Service', response);
      if (response) return _this.getUserprofileWithSchools(uid);
      return _this.getUser(uid);
    })['catch'](function (err) {
      _logger2['default'].error('error in user getProfile service' + JSON.stringify(err));
      throw err;
    });
    return userPromise;
  };

  this.getUsersProfile = function (ids) {
    _logger2['default'].info('In Users getProfile Service', ids);
    var userResp = [];
    var schoolsRespPromises = [];
    var serviceRes = [];
    var promiseArr = [];
    var userSchoolPromise = _this.userDelegate.getUsers(ids).then(function (userRes) {
      userResp = userRes;
      return _this.userDelegate.getSchoolsByUserIds(ids);
    }).then(function (schoolsRes) {
      _lodash2['default'].each(userResp, function (user) {
        var userDet = {};
        _lodash2['default'].each(schoolsRes, function (schRes) {
          if (schRes.userId === user.uid) {
            (function () {
              userDet.schools = [];
              var school = {};
              userDet.id = user.id, userDet.name = user.name, userDet.fName = user.fName, userDet.lName = user.lName, userDet.email = user.email, userDet.thumbnail = user.thumbnail, userDet.uid = user.uid, userDet.username = user.username;
              school.id = schRes.schoolId.id, school.name = schRes.schoolId.name, school.saId = schRes.schoolId.saId, school.roleValue = schRes.roleValue;
              var linksPromise = _this.userDelegate.getLinks(schRes.schoolId.links, schRes.schoolId.saId).then(function (links) {
                if (links !== null) {
                  school.links = links;
                }
                userDet.schools.push(school);
                return userDet;
              });
              promiseArr.push(linksPromise);
            })();
          }
        });
        var schoolLinksPromise = Promise.all(promiseArr).then(function (response) {
          return response;
        }).then(function (response) {
          serviceRes.push(userDet);
          return response;
        });
        schoolsRespPromises.push(schoolLinksPromise);
      });
      return Promise.all(schoolsRespPromises).then(function (userSchools) {
        return serviceRes;
      });
    })['catch'](function (err) {
      _logger2['default'].error('error in user getUserprofileWithSchools service' + JSON.stringify(err));
      throw err;
    });
    return userSchoolPromise;
  };

  this.getUserprofileWithSchools = function (uid) {
    var userPromise = _this.userDelegate.getUserProfileWithSchools(uid).then(function (response) {
      var promiseArr = [];
      var serviceRes = {};
      serviceRes.schools = [];
      _lodash2['default'].each(response, function (arg) {
        var school = {};
        if (typeof arg.username !== 'undefined' || arg.username) {
          serviceRes.id = arg.id, serviceRes.name = arg.name, serviceRes.fName = arg.fName, serviceRes.lName = arg.lName, serviceRes.email = arg.email, serviceRes.thumbnail = arg.thumbnail, serviceRes.uid = arg.uid, serviceRes.username = arg.username;
        } else {
          school.id = arg.schoolId.id, school.name = arg.schoolId.name, school.saId = arg.schoolId.saId, school.roleValue = arg.roleValue;
          var linksPromise = _this.userDelegate.getLinks(arg.schoolId.links, arg.schoolId.saId).then(function (links) {
            if (links !== null) {
              school.links = links;
            }
            serviceRes.schools.push(school);
            return serviceRes;
          });
          promiseArr.push(linksPromise);
        }
      });
      return Promise.all(promiseArr).then(function (response) {
        return response[0];
      });
    })['catch'](function (err) {
      _logger2['default'].error('error in user getUserprofileWithSchools service' + JSON.stringify(err));
      throw err;
    });
    return userPromise;
  };

  this.getUser = function (uid) {
    _logger2['default'].info('In User getUser Service', uid);
    var userPromise = _this.userDelegate.getUser(uid).then(function (userRes) {
      var serviceRes = {};
      _lodash2['default'].each(userRes, function (user) {
        serviceRes.id = user.id, serviceRes.name = user.name, serviceRes.fName = user.fName, serviceRes.lName = user.lName, serviceRes.email = user.email, serviceRes.uid = user.uid, serviceRes.username = user.username, serviceRes.thumbnail = user.thumbnail;
        user.roleValue ? serviceRes.roleValue = user.roleValue : '';
      });
      return serviceRes;
    })['catch'](function (err) {
      _logger2['default'].error('error in user getProfile service' + JSON.stringify(err));
      throw err;
    });
    return userPromise;
  };

  this.getSchools = function (uid) {
    var promiseArr = [];
    var userPromise = _this.userDelegate.getSchools(uid).then(function (response) {
      console.log('Response---', response);
      var serviceRes = [];
      _lodash2['default'].each(response, function (arg) {
        var school = {};
        console.log('Arg---', arg);
        school.id = arg.schoolId.id, school.name = arg.schoolId.name, school.saId = arg.schoolId.saId, school.roleValue = arg.roleValue;
        var linkPromise = _this.userDelegate.getLinks(arg.schoolId.links, arg.schoolId.saId).then(function (links) {
          if (links !== null) {
            school.links = links;
          }
          serviceRes.push(school);
          return serviceRes;
        });
        promiseArr.push(linkPromise);
      });
      return Promise.all(promiseArr).then(function (response) {
        return response[0];
      });
    })['catch'](function (err) {
      _logger2['default'].error('error in user getSchools service' + JSON.stringify(err));
      throw err;
    });
    return userPromise;
  };

  this.userDelegate = new _delegatesUser2['default']();
};

exports['default'] = UserService;
module.exports = exports['default'];