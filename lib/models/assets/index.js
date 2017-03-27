import mongoose from 'mongoose';

let purposeTypeEnum = ['teach','assess','practice']
let contentTypeEnum = ['textbook','booklet','video','audio','scorm','htm']
let fileTypeEnum = ['mp4','mov','mp3','wav','epub','pdf','html','html5','scorm']
let Schema = mongoose.Schema;
let assetsSchema = new mongoose.Schema({
  name             : { type : String, required : true, trim: true },
  description      : { type : String, required : true, trim: true },
  contentTypeValue : { type : String, required : true, enum: contentTypeEnum},
  fileType         : { type : String, required : true, enum: fileTypeEnum}, 
  url              : { type : String, required : true, trim: true},  
  thumbnailUrl     : { type : String, trim: true},
  purposes         : [{ type : String, enum: purposeTypeEnum}], 
  section          : { type : String, trim: true}, 
  lookUp           : { 	
  	originId : {type : String, required : true, trim: true},
  	source   : {type : String, required : true, trim: true}
  },
  topic : {  
    name : {type : String, trim: true},
    subtopic : {  
      name : {type : String, trim: true},
      subtopic  : {  
        name : {type : String, trim: true}
      }
    }
  }
}, 
{
  toJSON: { virtuals: true  }
});

assetsSchema.filterFields = ['purposes','section','contentTypeValue','fileType','topic','subTopic1','subTopic1_1'];
assetsSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}

let assetsModel = mongoose.model('asset', assetsSchema, 'asset');
module.exports = assetsModel;