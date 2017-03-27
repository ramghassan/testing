import Boom from 'boom';
import Joi from 'joi';
import http from 'http-as-promised';
import reporter from 'good-console';
import logger from '../logger';
import cacheUtil from '../utils/cacheutil';
import apiMapper from '../utils/jsonapimapper';
import AssetsService from '../services/asset';
import AppUtil from '../utils/apputil';

class AssetHandler {
  constructor() {
    this.assetsService = new AssetsService();
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
      description: 'Get Asset',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
       query: {
         id: Joi.string().trim().required()
       }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: this.standardHTTPErrors
        }
      },
      handler: (request, reply) => {
        logger.info('Start get asset handler ', {filename: __filename, pid: process.pid});
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then((userSession) => {
        /*  if(!AppUtil.isPearsonAdmin(userSession.roleValue) || !request.headers.padminToken){            
            return reply(Boom.methodNotAllowed('User is not pearson admin')); 
          }
          console.log(request.headers);*/
          let ids = request.query.id;
          if(ids){
              ids = request.query.id.replace(/\s/g,'').split(',');
          }
          return this.assetsService.get(ids)               
        })
        .then((serviceRes) => {
          console.log("typeof serviceRes ", typeof serviceRes);
          logger.info("Response get on asset Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);  
        })
        .catch((err) => {
          logger.error('Error get on asset Handler....'+ JSON.stringify(err));
          return reply(Boom.badImplementation('Error getting asset', err));
        })
        return cacheUtil;
      }
    }
  }

  put = () => {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Create assets',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        payload : Joi.object({
          asset: Joi.array().items({    
            name: Joi.string().trim().required(), 
            description: Joi.string().trim().required(), 
            contentTypeValue: Joi.string().trim().required(),
            fileType: Joi.string().trim().required(),  
            url: Joi.string().trim().required(), 
            thumbnailUrl: Joi.string().trim().allow(''),
            purposes: Joi.array().items(Joi.string().trim().allow('')),
            section: Joi.string().trim().allow(''),
            topic: Joi.object({  
              name: Joi.string().trim().allow(''),
              subtopic: Joi.object({  
                name: Joi.string().trim().allow(''),
                subtopic: Joi.object({  
                  name: Joi.string().trim().allow('')
                })
              })
            }),
            lookUp : Joi.object({    
              originId: Joi.string().trim().required(), 
              source: Joi.string().trim().required()
            }).required()
          })
        })
      }, 
      handler: (request, reply) => {
        logger.info('Start put assets handler ', {filename: __filename, pid: process.pid});
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then((userSession) => {
          if(!AppUtil.isPearsonAdmin(userSession.roleValue)){
            return Boom.methodNotAllowed('User is not pearson admin'); 
          }
          let payload = apiMapper.serialize('asset', request.payload);
          return this.assetsService.put(payload)                   
        })
        .then((serviceRes) => {
          logger.info("Response put on assets Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);  
        })
        .catch((responseErr) => {
          logger.error('Error put on assets Handler....'+ JSON.stringify(responseErr));
          if(responseErr.err) return reply(Boom.badRequest(responseErr.err.message));
           return reply(Boom.badImplementation('Error in assets Handler', responseErr));
        })
        return promise;
      }
    }
  }

  assetSchool = () => {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Provision asset to school',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
        payload : Joi.object({
          assetSchool: Joi.array().items({    
            schoolId: Joi.string().trim().required(), 
            assetId: Joi.string().trim().required()
          })
        })
      }, 
      handler: (request, reply) => {
        logger.info('Start put assetSchool handler ', {filename: __filename, pid: process.pid});
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then((userSession) => {
          if(!AppUtil.isPearsonAdmin(userSession.roleValue)){
            return Boom.methodNotAllowed('User is not pearson admin'); 
          }
          let payload = apiMapper.serialize('assetSchool', request.payload);
          return this.assetsService.assetSchool(payload)                   
        }) 
        .then((serviceRes) => {
          logger.info("Response put on assetSchool Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);  
        })
        .catch((responseErr) => {
          logger.error('Error put on assetSchool Handler....'+ JSON.stringify(responseErr));
          if(responseErr.err) return reply(Boom.badRequest(responseErr.err.message));
           return reply(Boom.badImplementation('Error in assetSchool Handler', responseErr));
        })
        return promise;
      }
    }
  }

  getAssetSchool = () => {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'Get School Asset',
      notes: ['Only user with role pearson-admin can call this function'],
      validate: {
       query: {
         id: Joi.string().trim().allow(''),
         schoolId: Joi.string().trim().allow('')
       }
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: this.standardHTTPErrors
        }
      },
      handler: (request, reply) => {
        logger.info('Start get school asset handler ', {filename: __filename, pid: process.pid});
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then((userSession) => {
          if(!AppUtil.isPearsonAdmin(userSession.roleValue)){
            return reply(Boom.methodNotAllowed('User is not pearson admin')); 
          }
          let ids = request.query.id;
          let schoolIds = request.query.schoolId;
          if(ids){
              ids = request.query.id.replace(/\s/g,'').split(',');
          }
          if(schoolIds){
              schoolIds = request.query.schoolId.replace(/\s/g,'').split(',');
          }
          return this.assetsService.getAssetSchool(ids, schoolIds)               
        })
        .then((serviceRes) => {
          logger.info("Response get on school asset Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes);  
        })
        .catch((err) => {
          logger.error('Error get on school asset Handler....'+ JSON.stringify(err));
          return reply(Boom.badImplementation('Error getting school asset', err));
        })
        return cacheUtil;
      }
    }
  }

  assetAuthorized = () => {
    return {
      auth: 'bearer',
      tags: ['api', 'list'],
      description: 'api to check user is authorized for an asset',
      validate: {
        headers:Joi.object({
             assetid: Joi.string().trim().required()
        }).options({ allowUnknown: true })
      },
      notes: ['User with role pearson-admin always return 200 and for others, user and asset must be mapped to at least 1 common school'],
      handler: (request, reply) => {
        logger.info('Start put assetAuthorized handler ', {filename: __filename, pid: process.pid});
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then((userSession) => {
          logger.info("Response on userSession....", JSON.stringify(userSession));
          let payload = {"userId" : userSession.userId, "roleValue" : userSession.roleValue,"token" : request.headers.authorization.split(' ')[1],"assetId" : request.headers.assetid}
          logger.info("Response on payload....", JSON.stringify(payload));
          return this.assetsService.assetAuthorized(payload)              
        }) 
        .then((serviceRes) => {
          logger.info("Response put on assetAuthorized Handler....", JSON.stringify(serviceRes));
          return reply(serviceRes); 
        })
        .catch((responseErr) => {
          logger.error('Error put on assetAuthorized Handler....'+ JSON.stringify(responseErr));
          if(responseErr.err) return reply(Boom.unauthorized(responseErr.err.message));
           return reply(Boom.badImplementation('Error in assetAuthorized Handler', responseErr));
        })
        return promise;
      }
    }
  }
}

export default AssetHandler;