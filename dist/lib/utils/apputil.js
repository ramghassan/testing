'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _configuration = require('../configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _guid = require('guid');

var _guid2 = _interopRequireDefault(_guid);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _configuration3 = _interopRequireDefault(_configuration);

var AppUtil = (function () {
  function AppUtil() {
    _classCallCheck(this, AppUtil);

    this.retreiveCacheDetails = function (request, reply) {
      _logger2['default'].info('start get', { filename: __filename, pid: process.pid });
      var deferred = _bluebird2['default'].pending();
      var token = request.headers.authorization.split(' ')[1];
      var result = {};
      request.server.methods.isAuthenticate(token, null, function (err, resp) {
        if (err) return reply(_boom2['default'].badImplementation('Error caching authInfo', err));
        result.email = resp.email;
        request.server.methods.cacheOrganizationInfo(resp.organization, null, function (err, resp) {
          if (err) return reply(_boom2['default'].badImplementation('Error caching organization Info', err));
          if (resp.organization && resp.organization.moodle) {
            result.moodle = {};
            _logger2['default'].info('Inside Organization Response -------------------------------');
            if (resp.organization.moodle[0]) {
              result.moodle.host = resp.organization.moodle[0].hostname;
              result.moodle.openAM = resp.organization.moodle[0].openamname;
              result.moodle.token = resp.organization.moodle[0].token;
            }
            result.organization = {};
            result.organization.id = resp.organization._id;
            result.organization.name = resp.organization.name;
          } else {
            return reply(_boom2['default'].badRequest('Organization info does not exists'));
          }
          _logger2['default'].info("retreiveCacheDetails cacheOrganizationInfo  " + JSON.stringify(result));
          return deferred.resolve(result);
        });
      });
      return deferred.promise;
    };

    this.encryptToken = function (userId) {
      _logger2['default'].info('start get', { filename: __filename, pid: process.pid });
      var key = _configuration2['default'].get('crypto:password');
      var cipher = _crypto2['default'].createCipher('aes-256-cbc', key);
      var encryptedUserId = cipher.update(userId.toString() || '', 'utf8', 'base64');
      encryptedUserId += cipher.final('base64');
      _logger2['default'].info('encryptedUserId:' + encryptedUserId);
      return encryptedUserId;
    };

    this.decryptToken = function (encryptedData) {
      _logger2['default'].info('start get', { filename: __filename, pid: process.pid });
      var key = _configuration2['default'].get('crypto:password');
      var decipher = _crypto2['default'].createDecipher('aes-256-cbc', key);
      var dec = decipher.update(encryptedData.toString(), 'base64', 'utf8');
      dec += decipher.final('utf8');
      _logger2['default'].info("after decryptToken" + dec);
      return dec;
    };

    this.renderServiceLookup = function (enrollment, requestInfo) {
      var openAm = requestInfo.moodle.openAM;
      if (!requestInfo.moodle.openAM) {
        var moodleName = requestInfo.moodle.host;
        var headerHost = moodleName.split("/")[0] + "//" + moodleName.split("/")[2] + "/";
        headerHost = headerHost.substring(0, 17) + 'tst' + headerHost.substring(20);
        openAm = headerHost;
        _logger2['default'].info("inside called" + openAm);
      }
      var guidStr = _guid2['default'].raw().toString().replace(/-/g, '').substring(0, 24);
      enrollment.serviceLookup.push({ "_id": guidStr, 'moodleHostName': requestInfo.moodle.host, 'moodleopenAM': openAm, 'website': _configuration3['default'].get('environment:URL') });
    };
  }

  _createClass(AppUtil, [{
    key: 'isDataExists',
    value: function isDataExists(data) {
      if (data !== null) {
        return true;
      }
      return false;
    }
  }, {
    key: 'isPearsonAdmin',
    value: function isPearsonAdmin(roleValue) {
      console.log('Is Pearson Admin ---' + roleValue);
      return roleValue === 'pearson-admin';
    }
  }, {
    key: 'isRoleTeacherInSchool',
    value: function isRoleTeacherInSchool(userProfile) {
      return userProfile && userProfile.schools && userProfile.schools[0].roleValue === 'teacher';
    }
  }]);

  return AppUtil;
})();

var apputil = new AppUtil();
exports['default'] = apputil;
module.exports = exports['default'];