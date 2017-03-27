import Config from '../../configuration';
import Boom from 'boom';
import Http from 'http-as-promised';
import logger from '../../logger';
import SchoolAdminDelegate from '../../delegates/schooladministration/pulseschooladmin';
import SchoolDelegate from '../../delegates/school/pulseschool'
import SchoolUserDelegate from '../../delegates/schooluser'
import UserDelegate from '../../delegates/user'
import Promise from 'bluebird';
import ServiceResponse from '../ServiceResponse';
import _ from 'lodash'

class SchoolService {
  constructor() {
    this.schoolDelegate = new SchoolDelegate();
    this.schoolUserDelegate = new SchoolUserDelegate();
    this.userDelegate = new UserDelegate();
    this.schoolAdminDelegate = new SchoolAdminDelegate();
  }

  get = (params) => { 
    return this.schoolDelegate.get(params);
  }

  put = (body) => {
    let serviceErr = {};
    let schoolPromise = this.schoolAdminDelegate.get(body.saId)
    .then((sa) => {
      logger.info('response put school Service', JSON.stringify(sa));
      if(!sa || sa.length == 0) {
        serviceErr.message='Invalid schoolsadministration id';
        throw new ServiceResponse(serviceErr,'',null);
      }              
      else {
        return this.schoolDelegate.put(body)
      }
    })
    .catch(function(err){
      logger.info('error in creating school Service' + JSON.stringify(err));
      if(typeof err.message !== 'undefined') { 
       serviceErr.message = err.message;
       throw new ServiceResponse(serviceErr,'',null);
      }
      throw err;
    })
    return schoolPromise;
  }

  getSchools = (geoId, saId, ids, userId, isPearsonAdmin) => {
    let promise;
    if(isPearsonAdmin){
      promise = this.schoolDelegate.getSchools(geoId, saId, ids);
    }
    else{
      promise = this.schoolUserDelegate.getSchools(userId, ids);
    }
    return promise.then(schoolsWithOwnLinks => {
      return this.overrideSchoolLinks(schoolsWithOwnLinks);
    })
    .catch(err => {
      logger.error('error getSchools', {filename: __filename, pid: process.pid, error: err.toString()});
      throw err;
    })
  }

  overrideSchoolLinks = (schools) => {
    schools = !schools ? [] : (!(schools instanceof Array) ? [schools] : schools);

    return Promise.all(
      _.map(schools, (school) => {
        let promise = this.userDelegate.getLinks(school.links, school.saId)
        .then(links => {
          if(links !== null){school.links = links;} 
          return school; 
        })
        .catch(err => {
          logger.error('error overrideSchoolLinks', {filename: __filename, pid: process.pid, error: err.toString()});
          throw err;
        })
        return promise;
    }))
  }
}

export default SchoolService;