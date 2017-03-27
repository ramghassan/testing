'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var roleTypeEnum = ['student', 'teacher'];
var Schema = _mongoose2['default'].Schema;
var schoolUserSchema = new Schema({
  userId: { ref: 'user', type: String, required: true, trim: true },
  schoolId: { ref: 'school', type: Schema.ObjectId, required: true, trim: true },
  roleValue: { type: String, 'enum': roleTypeEnum, required: true }
}, {
  toJSON: { virtuals: true }
});

schoolUserSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

schoolUserSchema.filterFields = ['id', "uid", "schoolId"];

var schooluser = _mongoose2['default'].model('schooluser', schoolUserSchema, 'schooluser');
module.exports = schooluser;