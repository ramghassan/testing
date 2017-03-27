import logger from '../../logger';
import apputil from '../../utils/apputil';
import SchoolUserModel from '../../models/schooluser';



class EnrollUserDelegate {
  constructor() {
  }

  get = (geoname) => {
    let query = { name : geoname};
    let enrollPromise = SchoolUserModel.findOne(query).exec()
    .then(function (user) {
      logger.info('Response get enroll user delegate ', JSON.stringify(user));
      return user;
    })
    .catch(function(err) {
      logger.error('Error get enroll user delegate', JSON.stringify(err));
      throw err;
    })
    return enrollPromise;
  }

  put = (body) => {
    let query = { userId : body.userId, schoolId : body.schoolId};
    let enrollInstance;    
    logger.info('Response put enroll user delegate ', JSON.stringify(query));
    let enrollPromise = SchoolUserModel.findOne(query).exec()
    .then(function (user) {
      if(user === null) {
        enrollInstance = new SchoolUserModel(body);
        logger.info('Response put enroll user delegate ', JSON.stringify(enrollInstance));
        return enrollInstance.save();
      }
      else{
        let err = {message:'User Already Enrolled'};
        throw err; 
      }
    })
    .catch(function(err) {
      logger.error('Error put enroll user delegate', JSON.stringify(err));
      throw err;
    })
    return enrollPromise;
  }

}

export default EnrollUserDelegate;