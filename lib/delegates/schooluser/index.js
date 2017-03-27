import SchoolUserModel from '../../models/schooluser';
import SchoolModel from '../../models/school';
import logger from '../../logger';
import _ from 'lodash';

class SchoolUserDelegate {

  getSchools(userId, schoolIds){
    let promise;
    if(schoolIds){
      promise = SchoolUserModel.find({userId : userId, schoolId : {$in : schoolIds}}, 'schoolId').populate({path: 'schoolId'}).exec()
    }
    else {
      promise = SchoolUserModel.find({userId : userId}, 'schoolId').populate({path: 'schoolId'}).exec()
    }
    return promise.then((schools) => {
      return _.pluck(schools, 'schoolId');
    })
    .catch(err => {
      logger.error('error getSchools', {filename: __filename, pid: process.pid, error: err.toString()});
      throw err;
    })
  }

  getSchoolsByUserID(userId){
    return SchoolUserModel.find({userId:userId}).exec();
  }
}

export default SchoolUserDelegate;