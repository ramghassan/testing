import Joi from 'joi';
import Boom from 'boom';
import UserService from '../services/user';
import apiMapper from '../utils/jsonapimapper';
import http from 'http-as-promised';
import logger from '../logger';
import AppUtil from '../utils/apputil';
import cacheUtil from '../utils/cacheutil';
import ForgeRockService from '../thirdparty/forgerock';
import UserSessionService from '../services/usersession';


class UserHandler {
  constructor() {    
    this.userService = new UserService();
    this.forgeRockService      = new ForgeRockService();
    this.userSessionService = new UserSessionService();
    
  }

  put = () => {
     return {
       tags: ['api'],
       auth: 'bearer',
       description: 'Create user',
       notes: ['Only user with role pearson admin can create the user'],
       validate: {                        
          payload : Joi.object({
           user: Joi.array().items({         
            name: Joi.string().trim().required(),
            username: Joi.string().trim().required(),
            password: Joi.string().trim().required(),
            email: Joi.string().trim().required().description('User email used for login')
                               .example('xyz@anymail.com'),
            fName: Joi.string().trim().required(),
            lName: Joi.string().trim().required(),
            thumbnail: Joi.string().trim().allow('')              
           }) 
          })
       },
        handler: (request, reply) => {
          let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
          .then(userSession => {           
            if(!AppUtil.isPearsonAdmin(userSession.roleValue)){
              return reply(Boom.methodNotAllowed('User is not pearson admin')); 
            }
           let payload = apiMapper.serialize('user', request.payload);
            let userPromise = this.forgeRockService.createUser(payload)
            .then( (response) => {                
                if(response.err) return reply(response.err);
                else {
                payload.uid=response.data.username;  
                payload.username = response.data.username;              
                return this.userService.put(payload); 
               }
            })     
          .then( (response) => { 
            if(!response.err) return reply(response);
          })
          .catch(function(err) {
            if(!err) return reply(Boom.badImplementation('Error inserting user', err));
          }); 
        });                  
      }
    }
   }


  getUserProfile = () => {
      return {
         tags: ['api'],
         auth: 'bearer',
         description: 'Get my profile',
         validate: {
           query: {
             id: Joi.string().trim().allow(''),
           }
        },
         handler: (request, reply) => {
          let userSession;
          let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
          .then(session => {
            userSession = session;
            if(!userSession.userId){
              return Boom.badImplementation('Error fetching userId'); 
            }
            return this.userService.getProfile(userSession.userId);
          })
          .then(userProfile => {
            if(request.query.id) {
             if((userProfile && AppUtil.isPearsonAdmin(userSession.roleValue)) || AppUtil.isRoleTeacherInSchool(userProfile))
              {
                  request.query.id = request.query.id.replace(/\s/g,'').split(',') ;
                  console.log("request.query.id", request.query.id);
                  return this.userService.getUsersProfile(request.query.id)
              } 
              else {
                return Boom.methodNotAllowed('User is not pearsonAdmin or teacher');  
              }
            }
            else {
              return this.userService.getProfile(userSession.userId);
            }
          })
          .then((response) => {
            console.log("user profile response is :::::::::::", response);
            return reply(response);
          })
          .catch(function(err) {           
              return reply(Boom.badImplementation('Error fetching user profile', err));
          });  
        }                  
      }
    }

  getSchools = () => {
    return {
      tags: ['api'],
      auth: 'bearer',
      description: 'Get my schools',
      notes: ['Get schools of the logged-in user'],
      handler: (request, reply) => {
        logger.info('Start get school for user handler ', {filename: __filename, pid: process.pid});
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then(userSession => {
          return this.userService.getSchools(userSession.userId);    
        })          
        .then((response) =>{  
          logger.info("Response get school for user handler", JSON.stringify(response));           
          return reply(response);
        })
        .catch(function(err) {
          logger.error('Error get school for user handler ...'+ JSON.stringify(err));
          return reply(Boom.badImplementation('Error getting school', err));
        });  
      }                  
    }  
  }

  login = () => {
   return {
       tags: ['api'],
       description: 'Login',
       notes: ['API for logging in using username & password'],
       validate: {              
           payload: {
               username: Joi.string().trim()
                   .required()
                   .description('the Username field cannot be empty'),
               password: Joi.string().trim()
                   .required()
                   .description('the Password field cannot be empty'),
           }          
       },
       handler: (request, reply) => {
         logger.info('start login', {filename: __filename, pid: process.pid});         
         let promise = this.forgeRockService.login(request.payload)
         .then(result => {
            return this.userSessionService.createSession(request.server, result.tokenId, request.headers, request.payload.username);         
         }) 
         .then(userSession => {
            return reply({access_token : userSession.token || ''});
         })
         .catch(err => {
            logger.error('error login', {filename: __filename, pid: process.pid, error: err.toString()});
            return reply(Boom.badRequest("Error Authenticating User"));
         })
      }
    }
  }

  logout() {
      return {
          auth: 'bearer',
          tags: ['api'],
          description: 'Logout',
          notes: ['API for logging out user with a valid token set in the request header (Authorization: Bearer tokenXXXX)'],
          handler: (request, reply) => {         
        let token = request.headers.authorization.split(' ')[1];
        let promise = this.userSessionService.removeSession(token)
        .then(result => {           
            return cacheUtil.dropSessionFromCache(request.server, token)               
         })
        .then(result => {          
           if(result) return this.forgeRockService.logout(token)            
         }) 
        .then((response)=>{          
          return reply('success');
         })
         .catch( (err)=>{
          logger.error('error logout', {filename: __filename, pid: process.pid, error: err.toString()});
            return reply(Boom.badRequest("Error in logout"));
         })
        }
      }
  }

  isTokenValid() {
    return {
        auth: 'bearer',
        tags: ['api'],
        description: 'validate forgerock token',
        notes: ['API for a valid token set in the request header (Authorization: Bearer tokenXXXX)'],
        validate: {
           query: {
             id: Joi.string().required()
           }
        },
        handler: (request, reply) => {         
        let token = request.headers.authorization.split(' ')[1];
        logger.info('Start isTokenValid ', {filename: __filename, pid: process.pid});
        let promise = cacheUtil.getSessionFromCache(request.server, request.headers.authorization.split(' ')[1])
        .then(userSession => {          
        if(userSession.userId === request.query.id) {        
         this.forgeRockService.isTokenValid(token)
         .then((result)=>{
            return reply(result.valid); 
          })  
         }  
         else { 
        return reply(Boom.methodNotAllowed('Invalid id'));          
      }
        }) 
        .catch( (err)=>{
          logger.error('error in validate token', {filename: __filename, pid: process.pid, error: err.toString()});
            return reply(Boom.badRequest("Error in validate token"));
         })
        }
    }
  }
}
export default UserHandler;