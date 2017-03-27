import logger from '../../logger';
import apputil from '../../utils/apputil';
import SchoolAdminModel from '../../models/schooladministration';
import SchoolModel from '../../models/school';
import _ from 'lodash'

class SchoolDelegate {
  constructor() {
  }
  
  getSchools = (geoIds, saIds, schoolIds) => {
    let promise;  

    geoIds = geoIds && !(geoIds instanceof Array) ?  [geoIds] : geoIds;
    saIds = saIds && !(saIds instanceof Array) ? [saIds] : saIds;

    console.log("geoIds and saIds and schoolIds are ", geoIds, saIds, schoolIds);
    let options = { path: 'saId', select: '_id', match: { geoId : {$in :[geoIds]}} };

    if (geoIds && saIds && schoolIds){
      promise = SchoolModel.find({saId : {$in: saIds}, _id : {$in: schoolIds}}).populate(options).exec();
    }
    else if(geoIds && saIds){
       promise = SchoolModel.find({saId : {$in: saIds}}).populate(options).exec(); 
    }
    else if(geoIds && schoolIds){
      promise = SchoolModel.find({_id : {$in: schoolIds}}).populate(options).exec();  
    }
    else if(saIds && schoolIds){
      promise = SchoolModel.find({saId : {$in: saIds}, _id : {$in: schoolIds}}).exec();
    }
    else if(geoIds) {
      promise = SchoolModel.find({}).populate(options).exec();
    }
    else if(saIds) {
      promise = SchoolModel.find({saId : {$in: saIds}}).exec();
    }
    else if(schoolIds) {
      promise = SchoolModel.find({_id : {$in: schoolIds}}).exec();
    }
    else {
      promise = SchoolModel.find({}).exec(); 
    }
    return promise.then((schools) => {
      return _.compact(_.map(schools, school => {
        console.log("Before remove null saIds from schools is ", school);
        if(school.saId){
          school.saId = school.saId._id || school.saId; 
          return school;
        }
        else return null;
      }));
    })
    .catch(err => {
      logger.error('error getSchools', {filename: __filename, pid: process.pid, error: err.toString()});
      throw err;
    })
  }

  get = (schoolid) => {
    let query = { _id : schoolid};
    let schoolPromise = SchoolModel.findOne(query).exec()
    .then(function (school) {
      logger.info('Response get school delegate ', JSON.stringify(school));
      return school;
    })
    .catch(function(err) {
      logger.error('Error get school delegate', JSON.stringify(err));
      throw err;
    })
    return schoolPromise;
  }
	
  put = (body) => {
    let query = { name : body.name, saId : body.saId};
    let schoolInstance;
    let schoolPromise = SchoolModel.findOne(query).exec()
    .then(function (school) {
      if(school === null) {
        schoolInstance = new SchoolModel(body);
        logger.info('Response put school delegate ', JSON.stringify(schoolInstance));
        return schoolInstance.save();
      }else{
        let err = {message:'Schools name already created with same saId'};
        throw err; 
      }
    })
    .catch(function(err) {
      logger.error('Error put school delegate', JSON.stringify(err));
      throw err;
    })
    return schoolPromise;
  }

  isValidSchoolID = (id) => {
    return SchoolModel.findOne({_id:id}).exec();
  }
}

export default SchoolDelegate;