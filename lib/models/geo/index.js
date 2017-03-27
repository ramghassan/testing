import mongoose from 'mongoose';

let Schema =  mongoose.Schema;
let geoSchema = new Schema({
  name            : { type : String, required : true, trim: true },
  links           : { 	
  						terms : {type : String, trim: true},
  						privacy : {type : String, trim: true},
  						cookie : {type : String, trim: true},
  						moodle : {type : String, trim: true},
  						services : {type : String, trim: true},
  						website : {type : String, trim: true},
  						languagePack : {type : String, trim: true}
                     } 
},
{
  toJSON: { virtuals: true  }
});

geoSchema.filterFields = ["name"];



geoSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}

let geo = mongoose.model('geo', geoSchema,'geo');
module.exports = geo;