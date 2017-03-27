'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var Schema = _mongoose2['default'].Schema;

var roleTypeEnum = ['pearson-admin', 'student', 'teacher'];

var userSchema = new _mongoose2['default'].Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true },
  uid: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  fName: { type: String, required: true, trim: true },
  lName: { type: String, required: true, trim: true },
  thumbnail: { type: String, trim: true },
  roleValue: { type: String, 'enum': roleTypeEnum }
}, {
  toJSON: { virtuals: true }
});

userSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

userSchema.filterFields = ['name', 'email'];

var userModel = _mongoose2['default'].model('user', userSchema, 'user');
module.exports = userModel;