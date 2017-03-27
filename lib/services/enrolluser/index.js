import Config from '../../configuration';
import Boom from 'boom';
import Http from 'http-as-promised';
import logger from '../../logger';
import EnrollUserDelegate from '../../delegates/enrolluser/pulseenrolluser'
import UserDelegate from '../../delegates/user'
import SchoolDelegate from '../../delegates/school/pulseschool'
import ServiceResponse from '../ServiceResponse'

class EnrollUserService {
  constructor() {
    this.enrollUserDelegate = new EnrollUserDelegate();
    this.userDelegate = new UserDelegate();
    this.schoolDelegate = new SchoolDelegate();
  }

  get = (params) => { 
    return this.enrollUserDelegate.get(params);
  }

  put = (payload) => {
    let serviceErr = {};
    let enrollCreationPromise = this.userDelegate.getUserByuid(payload.userId)
    .then((userRes) => {
      console.log("payload.uid  "+payload.userId+"    "+JSON.stringify(userRes) + payload.schoolId);     
      if(!userRes) {
          serviceErr.message='Invalid uid';
          throw new ServiceResponse(serviceErr,'',null);
        }              
        else {
        logger.info('response put enroll user Service valid user', JSON.stringify(userRes.email));
        return this.schoolDelegate.isValidSchoolID(payload.schoolId);
      }
       
    })
    .then((schoolRes) => {
      console.log("payload.SchoolId  "+payload.schoolId+"    "+JSON.stringify(schoolRes));
      if(!schoolRes) {
          serviceErr.message='Invalid school id';
          throw new ServiceResponse(serviceErr,'',null);
       } 
      else {
        logger.info('response put enroll user Service valid school', JSON.stringify(schoolRes.name));
       return this.enrollUserDelegate.put(payload);
     }
    })
    .catch(function(err){
      logger.info('error in creating enroll user Service', JSON.stringify(err));
      
      if(typeof err.message !== 'undefined') { 
       serviceErr.message = err.message;
       throw new ServiceResponse(serviceErr,'',null);
      }
      throw err;
    })
    return enrollCreationPromise;
  }
}

export default EnrollUserService;