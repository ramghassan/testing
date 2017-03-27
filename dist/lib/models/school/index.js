'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var Schema = _mongoose2['default'].Schema;
var schoolSchema = new Schema({
  name: { type: String, required: true, trim: true },
  saId: { ref: 'schoolsadministration', type: Schema.ObjectId, required: true, trim: true },
  links: {
    terms: { type: String, trim: true },
    privacy: { type: String, trim: true },
    cookie: { type: String, trim: true },
    moodle: { type: String, trim: true },
    services: { type: String, trim: true },
    website: { type: String, trim: true },
    languagePack: { type: String, trim: true }
  },
  fallbackLinks: {
    terms: { type: String, trim: true },
    privacy: { type: String, trim: true },
    cookie: { type: String, trim: true },
    moodle: { type: String, trim: true },
    services: { type: String, trim: true },
    website: { type: String, trim: true },
    languagePack: { type: String, trim: true }
  }

}, {
  toJSON: { virtuals: true }
});

schoolSchema.filterFields = ['name', "saId", "links"];

schoolSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

var school = _mongoose2['default'].model('school', schoolSchema, 'school');
module.exports = school;