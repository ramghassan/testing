'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _modelsUser = require('../../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var _modelsSchooluser = require('../../models/schooluser');

var _modelsSchooluser2 = _interopRequireDefault(_modelsSchooluser);

var _modelsSchooladministration = require('../../models/schooladministration');

var _modelsSchooladministration2 = _interopRequireDefault(_modelsSchooladministration);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _modelsGeo = require('../../models/geo');

var _modelsGeo2 = _interopRequireDefault(_modelsGeo);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _utilsApputil = require('../../utils/apputil');

var _utilsApputil2 = _interopRequireDefault(_utilsApputil);

var UserDelegate = function UserDelegate() {
  _classCallCheck(this, UserDelegate);

  this.getUserRole = function (email) {
    var userPromise = _modelsUser2['default'].findOne({ email: email }).then(function (data) {
      if (!data) throw "This user is not authorized to use this application";
      return data;
    })['catch'](function (err) {
      throw err;
    });
    return userPromise;
  };

  this.put = function (body) {
    var query = { email: body.email };
    var userInstance = undefined;
    var userPromise = _modelsUser2['default'].findOne(query).then(function (user) {
      if (user === null) {
        userInstance = new _modelsUser2['default'](body);
        return userInstance.save();
      }
      return user;
    })['catch'](function (err) {
      throw err;
    });
    return userPromise;
  };

  this.getUserByEmail = function (email) {
    return _modelsUser2['default'].findOne({ email: email }).exec();
  };

  this.getUserByuid = function (uid) {
    return _modelsUser2['default'].findOne({ uid: uid }).exec();
  };

  this.isUserEnrolled = function (uid) {
    return _modelsSchooluser2['default'].find({ userId: uid }).exec().then(function (data) {
      if (data.length >= 1) return true;
      return false;
    })['catch'](function (err) {
      throw err;
    });
  };

  this.getUserProfileWithSchools = function (uid) {
    var schoolUserRes = [];
    var userPromise = _modelsSchooluser2['default'].find({ userId: uid }, { id: 0 }).populate({ path: 'schoolId',
      select: 'name saId links' }).exec().then(function (schoolRes) {
      schoolUserRes = schoolRes;
      return _modelsUser2['default'].findOne({ uid: uid }).exec();
    }).then(function (userRes) {
      schoolUserRes.push(userRes);
      return schoolUserRes;
    })['catch'](function (err) {
      throw err;
    });
    return userPromise;
  };

  this.getSchoolsByUserIds = function (uids) {
    return _modelsSchooluser2['default'].find({ userId: { $in: uids } }).populate({ path: 'schoolId',
      select: 'name saId links' }).exec();
  };

  this.getUsers = function (uids) {
    return _modelsUser2['default'].find({ uid: { $in: uids } }).exec();
  };

  this.getUser = function (uid) {
    return _modelsUser2['default'].find({ uid: uid }).exec();
  };

  this.getLinks = function (links, said) {
    var keys = [];
    var saLinks = undefined;
    var geoLinks = undefined;
    var schoolLinks = links.toObject();
    var saPromise = _modelsSchooladministration2['default'].findOne({ _id: said }).exec().then(function (sa) {
      saLinks = sa.links.toObject();
      return _modelsGeo2['default'].findOne({ _id: sa.geoId }).exec();
    }).then(function (geo) {
      geoLinks = geo.links.toObject();
      keys = Object.keys(saLinks).concat(Object.keys(geoLinks)).concat(Object.keys(schoolLinks));
      keys = _lodash2['default'].uniq(keys);
      for (var index in keys) {
        if (schoolLinks === null || typeof schoolLinks[keys[index]] === 'undefined' || !schoolLinks[keys[index]]) {
          schoolLinks[keys[index]] = !saLinks[keys[index]] ? !geoLinks[keys[index]] ? '' : geoLinks[keys[index]] : saLinks[keys[index]];
        }
      }
      return schoolLinks;
    }).then(function (schoolLinks) {
      var linksKeys = Object.keys(schoolLinks);
      if (linksKeys.length < 1) return null;else {
        for (var index in linksKeys) {
          if (!schoolLinks[linksKeys[index]]) {
            delete schoolLinks[linksKeys[index]];
          }
        }
        return schoolLinks;
      }
    })['catch'](function (err) {
      throw err;
    });
    return saPromise;
  };

  this.getSchools = function (uid) {
    return _modelsSchooluser2['default'].find({ userId: uid }, '-_id -uid -__v').populate({ path: 'schoolId', select: 'name saId links _id' }).exec();
  };
};

exports['default'] = UserDelegate;
module.exports = exports['default'];