import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let userSessionSchema = new Schema({
  userId           : { ref  :'user', type: String, required : true},  
  deviceId         : { type : String, required : true, trim: true},
  token            : { type : String, required : true, trim: true},
  startTime        : { type : Date, required : true, default: Date.now},
  userAgent        : { type : String, required : true, trim: true},
  language         : { type : String, required : true, trim: true}
});

userSessionSchema.filterFields = ['userId','deviceId','token','startTime','userAgent'];

let userSessionModel = mongoose.model('usersession', userSessionSchema,'usersession');
module.exports = userSessionModel;