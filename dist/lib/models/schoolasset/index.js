'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var Schema = _mongoose2['default'].Schema;
var schoolAssetSchema = new _mongoose2['default'].Schema({
  schoolId: { type: String, required: true, trim: true },
  assetId: { ref: 'asset', type: Schema.ObjectId, required: true, trim: true }
}, {
  toJSON: { virtuals: true }
});

schoolAssetSchema.filterFields = ['schoolId', 'assetId'];
schoolAssetSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

var schoolAssetModel = _mongoose2['default'].model('schoolasset', schoolAssetSchema, 'schoolasset');
module.exports = schoolAssetModel;