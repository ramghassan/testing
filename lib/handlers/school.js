import Boom from 'boom';
import Joi from 'joi';
import SchoolService from '../services/school';
import AppUtil from '../utils/apputil';
import http from 'http-as-promised';
import reporter from 'good-console';
import logger from '../logger';
import SchoolAdminService from '../services/schooladministration';
import cacheUtil from '../utils/cacheutil';
import apiMapper from '../utils/jsonapimapper';
import EnrolluserService from '../services/enrolluser';

class SchoolHandler {
  constructor() {
    this.schoolService = new SchoolService();
    this.schoolAdminService = new SchoolAdminService();
    this.enrolluserService = new EnrolluserService();
  }

  standardHTTPErrors = [{
    code: 400,
    message: 'Bad Request'
  }, {
    code: 500,
    message: 'Internal Server Error'
  }];

  get = () => {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Get School',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        params: {
          schoolid: Joi.string().trim().required()
        },
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: this.standardHTTPErrors
        }
      },
      handler: (request, reply) => {
        logger.info('Start get School handler ', {filename: __filename, pid: process.pid});
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then((userSession) => {
          if(!AppUtil.isPearsonAdmin(userSession.roleValue)){
            return reply(Boom.methodNotAllowed('User is not pearson admin')); 
          }
          return this.schoolService.get(request.params.schoolid)               
        })
        .then((serviceRes) => {
          logger.info("Response get on School Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);  
        })
        .catch((err) => {
          logger.error('Error get on School Handler....'+ JSON.stringify(err));
          return reply(Boom.badImplementation('Error getting school', err));
        })
        return cacheUtil;
      }
    }
  }

  put = () => {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Create School',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        payload : Joi.object({
          school: Joi.array().items({     
            name: Joi.string().trim().required(),
            saId: Joi.string().trim().required(),
            links : Joi.object({
              terms : Joi.string().trim().allow(''),
              privacy : Joi.string().trim().allow(''),
              cookie : Joi.string().trim().allow(''),
              moodle : Joi.string().trim().allow(''),
              services : Joi.string().trim().allow(''),
              website : Joi.string().trim().allow(''),
              languagePack : Joi.string().trim().allow('')
            })
          })
        })
      },
      handler: (request, reply) => {
        logger.info('Start put school handler ', {filename: __filename, pid: process.pid});
        let payload;
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then((userSession) => {
          if(!AppUtil.isPearsonAdmin(userSession.roleValue)){
            return reply(Boom.methodNotAllowed('User is not pearson admin')); 
          }
          payload = apiMapper.serialize('school', request.payload);
          return this.schoolService.put(payload);         
        }) 
        .then((serviceRes) => {
          logger.info("Response put on school Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);  
        })
        .catch((responseErr) => {
          logger.error('Error put on geo Handler....'+ JSON.stringify(responseErr));
          if(responseErr.err) return reply(Boom.badRequest(responseErr.err.message));
           return reply(Boom.badImplementation('Error in enrolling user', responseErr));
        })
        return cacheUtil;
      }
    }
  }

  getSchools = () => {
   return {
     auth: 'bearer',
     tags: ['api', 'list'],
     description: 'get schools by Id(s) or saId or geoId',
     notes: ['get schools by Id(s) or saId or geoId'],
     validate: {
       query: {
         id: Joi.string().trim(),
         saId: Joi.string().trim(),
         geoId: Joi.string().trim()
       }
     },
     handler: (request, reply) => {
       let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
       .then(userSession => {
           let isPearsonAdmin = AppUtil.isPearsonAdmin(userSession.roleValue);
           let userId = userSession.userId;
           if(request.query.id) {
             request.query.id = request.query.id.replace(/\s/g,'').split(',') 
           }
           if(!isPearsonAdmin && request.query.saId){
              return Boom.methodNotAllowed('saId is allowed only for pearson admin'); 
           }
           else if(!isPearsonAdmin && request.query.geoId){
              return Boom.methodNotAllowed('geoId is allowed only for pearson admin'); 
           }
           else {
              return this.schoolService.getSchools(request.query.geoId, request.query.saId, request.query.id, userId, isPearsonAdmin);
           }
       })
       .then((schools) => {
          return reply(schools);
       })       
       .catch((err) => {
         logger.error('Error on getSchools....'+ JSON.stringify(err));
         return reply(Boom.badImplementation('Error in getSchools', err));
       })
       return promise;
     }
    }
  }

  enrollUser = () => {    
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Enroll user to  a school',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        payload : Joi.object({
          enrollment: Joi.array().items({         
            userId: Joi.string().trim().required(),
            schoolId : Joi.string().trim().required(),
            roleValue: Joi.string().trim().required()
         }) 
        })
      },
      handler: (request, reply) => {        
        logger.info('Start put on enrolluser  handler ', {filename: __filename, pid: process.pid});
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then((userSession) => {
          if(!AppUtil.isPearsonAdmin(userSession.roleValue)){
            return reply(Boom.methodNotAllowed('User is not pearson admin')); 
          }
          let payload = apiMapper.serialize('enrollment', request.payload);          
          return this.enrolluserService.put(payload);                           
        })           
        .then((response) =>{  
          logger.info("Response put on enrolluser Handler....", JSON.stringify(response));                      
          return reply(response);
        })
        .catch(function(responseErr) {
          logger.error('Error put on enrolluser Handler....'+ JSON.stringify(responseErr) );           
           if(responseErr.err) return reply(Boom.badRequest(responseErr.err.message));
           return reply(Boom.badImplementation('Error in enrolling user', responseErr));
        });
      }
    }
  }
}

export default SchoolHandler;