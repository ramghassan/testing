'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _modelsSchooluser = require('../../models/schooluser');

var _modelsSchooluser2 = _interopRequireDefault(_modelsSchooluser);

var _modelsSchool = require('../../models/school');

var _modelsSchool2 = _interopRequireDefault(_modelsSchool);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var SchoolUserDelegate = (function () {
  function SchoolUserDelegate() {
    _classCallCheck(this, SchoolUserDelegate);
  }

  _createClass(SchoolUserDelegate, [{
    key: 'getSchools',
    value: function getSchools(userId, schoolIds) {
      var promise = undefined;
      if (schoolIds) {
        promise = _modelsSchooluser2['default'].find({ userId: userId, schoolId: { $in: schoolIds } }, 'schoolId').populate({ path: 'schoolId' }).exec();
      } else {
        promise = _modelsSchooluser2['default'].find({ userId: userId }, 'schoolId').populate({ path: 'schoolId' }).exec();
      }
      return promise.then(function (schools) {
        return _lodash2['default'].pluck(schools, 'schoolId');
      })['catch'](function (err) {
        _logger2['default'].error('error getSchools', { filename: __filename, pid: process.pid, error: err.toString() });
        throw err;
      });
    }
  }, {
    key: 'getSchoolsByUserID',
    value: function getSchoolsByUserID(userId) {
      return _modelsSchooluser2['default'].find({ userId: userId }).exec();
    }
  }]);

  return SchoolUserDelegate;
})();

exports['default'] = SchoolUserDelegate;
module.exports = exports['default'];