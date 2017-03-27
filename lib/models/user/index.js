import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let roleTypeEnum = ['pearson-admin','student','teacher']

let userSchema = new mongoose.Schema({
  name         : { type : String, required : true, trim: true },
  username     : {type : String, required : true, trim: true },
  uid          : {type : String, required : true, trim: true },
  email        : { type : String, required : true, trim: true },
  fName        : { type : String, required : true, trim: true},
  lName        : { type : String, required : true, trim: true}, 
  thumbnail    : { type : String, trim: true},  
  roleValue    : { type : String, enum:roleTypeEnum} 
},
{
  toJSON: { virtuals: true  }
});

userSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}

userSchema.filterFields = ['name','email'];

let userModel = mongoose.model('user', userSchema, 'user');
module.exports = userModel;
