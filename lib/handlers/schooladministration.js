import Boom from 'boom';
import Joi from 'joi';
import SchoolAdminService from '../services/schooladministration';
import GeoService from '../services/geo';
import AppUtil from '../utils/apputil';
import http from 'http-as-promised';
import reporter from 'good-console';
import logger from '../logger';
import cacheUtil from '../utils/cacheutil';
import apiMapper from '../utils/jsonapimapper';

class SchoolAdminHandler {
  constructor() {
    this.schoolAdminService = new SchoolAdminService();
    this.geoService = new GeoService();
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
      description: 'Get School Administration',
      notes: ['Only user with role pearson-admin can call this function.Get schoolsadministration by comma seperated list of schoolsadministration Id(s)'],
      validate: {
       query: {
         id: Joi.string().trim().allow(''),
         geoId: Joi.string().trim().allow('')
       }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: this.standardHTTPErrors
        }
      },
      handler: (request, reply) => {
        logger.info('Start get SA handler ', {filename: __filename, pid: process.pid});
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then((userSession) => {
          if(!AppUtil.isPearsonAdmin(userSession.roleValue)){
            return reply(Boom.methodNotAllowed('User is not pearson admin')); 
          }
          let ids = request.query.id;
          if(ids){
              ids = request.query.id.replace(/\s/g,'').split(',');
          }
          return this.schoolAdminService.get(ids, request.query.geoId)               
        })
        .then((serviceRes) => {
          logger.info("Response get on SA Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);  
        })
        .catch((err) => {
          logger.error('Error get on SA Handler....'+ JSON.stringify(err));
          return reply(Boom.badImplementation('Error getting SA', err));
        })
        return cacheUtil;
      }
    }
  }

  put = () => {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Create School Administration',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        payload : Joi.object({
          schoolAdmin : Joi.array().items({     
            name: Joi.string().trim().required(),
            geoId: Joi.string().trim().required(),
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
        logger.info('Start put SA handler ', {filename: __filename, pid: process.pid});
        let payload;
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then((userSession) => {
          if(!AppUtil.isPearsonAdmin(userSession.roleValue)){
            return reply(Boom.methodNotAllowed('User is not pearson admin')); 
          }
          payload = apiMapper.serialize('schoolAdmin', request.payload);
          return this.schoolAdminService.put(payload);         
        }) 
        .then((serviceRes) => {
          logger.info("Response put on SA Handler....", JSON.stringify(serviceRes));
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
}

export default SchoolAdminHandler;