import mongoose from 'mongoose';

let Schema = mongoose.Schema;
let schoolAssetSchema = new mongoose.Schema({
  schoolId     : { type : String, required : true, trim: true },
  assetId      : { ref : 'asset', type : Schema.ObjectId, required : true, trim: true },
}, 
{
  toJSON: { virtuals: true  }
});

schoolAssetSchema.filterFields = ['schoolId','assetId'];
schoolAssetSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}

let schoolAssetModel = mongoose.model('schoolasset', schoolAssetSchema, 'schoolasset');
module.exports = schoolAssetModel;
