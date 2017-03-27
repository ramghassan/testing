import mongoose from 'mongoose';

let Schema =  mongoose.Schema;
let schoolAdminSchema = new Schema({
  name            : { type : String, required : true, trim: true },
  geoId           : { ref : 'geo', type : Schema.ObjectId, required : true, trim: true },
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

schoolAdminSchema.filterFields = ['name','geoId','links'];

schoolAdminSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}

let schoolAdmin = mongoose.model('schoolsadministration', schoolAdminSchema,'schoolsadministration');
module.exports = schoolAdmin;