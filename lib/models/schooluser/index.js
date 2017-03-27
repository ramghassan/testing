import mongoose from 'mongoose';

let roleTypeEnum = ['student','teacher']
let Schema =  mongoose.Schema;
let schoolUserSchema = new Schema({
  userId       : { ref : 'user', type : String, required : true, trim: true  },
  schoolId     : { ref : 'school', type : Schema.ObjectId, required : true, trim: true},
  roleValue    : { type : String, enum:roleTypeEnum, required: true} 
},
{
  toJSON: { virtuals: true  }
});

schoolUserSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}

schoolUserSchema.filterFields = ['id',"uid","schoolId"];

let schooluser = mongoose.model('schooluser', schoolUserSchema,'schooluser');
module.exports = schooluser;