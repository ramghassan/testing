'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var Schema = _mongoose2['default'].Schema;
var schoolAdminSchema = new Schema({
  name: { type: String, required: true, trim: true },
  geoId: { ref: 'geo', type: Schema.ObjectId, required: true, trim: true },
  links: {
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

schoolAdminSchema.filterFields = ['name', 'geoId', 'links'];

schoolAdminSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

var schoolAdmin = _mongoose2['default'].model('schoolsadministration', schoolAdminSchema, 'schoolsadministration');
module.exports = schoolAdmin;