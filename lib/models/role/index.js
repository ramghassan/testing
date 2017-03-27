import mongoose from 'mongoose';
import config from '../../configuration';
let Schema =  mongoose.Schema;

let roleSchema = new Schema({  
  name  : { type : String,  required : true, trim: true},
});

let role = mongoose.model('role', roleSchema,'role');
module.exports = mongoose;
