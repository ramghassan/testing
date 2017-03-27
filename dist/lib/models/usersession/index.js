'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var Schema = _mongoose2['default'].Schema;

var userSessionSchema = new Schema({
  userId: { ref: 'user', type: String, required: true },
  deviceId: { type: String, required: true, trim: true },
  token: { type: String, required: true, trim: true },
  startTime: { type: Date, required: true, 'default': Date.now },
  userAgent: { type: String, required: true, trim: true },
  language: { type: String, required: true, trim: true }
});

userSessionSchema.filterFields = ['userId', 'deviceId', 'token', 'startTime', 'userAgent'];

var userSessionModel = _mongoose2['default'].model('usersession', userSessionSchema, 'usersession');
module.exports = userSessionModel;