import fs from 'fs';
import Joi from 'joi';
import path from 'path';
import Boom from 'boom';
import Promise from 'bluebird';
import crypto from 'crypto';
import config from '../configuration';
import guid from 'guid';
import logger from '../logger';
import Config from '../configuration';

class AppUtil {

  isDataExists(data){
    if(data !== null) {
      return true;
    }
    return false;
  }

  isPearsonAdmin(roleValue) {
    console.log('Is Pearson Admin ---' + roleValue);
    return roleValue === 'pearson-admin';
  }

  isRoleTeacherInSchool(userProfile) {
    return userProfile && userProfile.schools && userProfile.schools[0].roleValue === 'teacher'
  }


  retreiveCacheDetails = (request,reply) =>{
    logger.info('start get', {filename: __filename, pid: process.pid});
    var deferred = Promise.pending();
    let token = request.headers.authorization.split(' ')[1];
    let result = {};
    request.server.methods.isAuthenticate(token, null, (err,  resp) => {
      if(err) return reply(Boom.badImplementation('Error caching authInfo', err));
      result.email = resp.email;
       request.server.methods.cacheOrganizationInfo(resp.organization,null,(err,  resp) => {
           if(err) return reply(Boom.badImplementation(
                      'Error caching organization Info'
                      , err)); 
        if(resp.organization && resp.organization.moodle){
        result.moodle = {};          
        logger.info('Inside Organization Response -------------------------------');
        if(resp.organization.moodle[0]) {
        result.moodle.host =resp.organization.moodle[0].hostname; 
        result.moodle.openAM =resp.organization.moodle[0].openamname; 
        result.moodle.token =resp.organization.moodle[0].token;
        }
        result.organization = {};
        result.organization.id = resp.organization._id;
        result.organization.name = resp.organization.name;
        }
        else{          
            return reply(Boom.badRequest('Organization info does not exists'));
        }
        logger.info("retreiveCacheDetails cacheOrganizationInfo  " + JSON.stringify(result));
        return deferred.resolve(result);
      })    
    })
    return deferred.promise;
  }

  encryptToken = (userId) =>{
    logger.info('start get', {filename: __filename, pid: process.pid});
    let key = config.get('crypto:password');
    let cipher = crypto.createCipher('aes-256-cbc', key);
    let encryptedUserId = cipher.update(userId.toString() || '', 'utf8', 'base64');
    encryptedUserId += cipher.final('base64');
    logger.info('encryptedUserId:' + encryptedUserId);
    return encryptedUserId;
  }

  decryptToken = (encryptedData) =>{
    logger.info('start get', {filename: __filename, pid: process.pid});
    let key = config.get('crypto:password');
    let decipher = crypto.createDecipher('aes-256-cbc', key);
    let dec = decipher.update(encryptedData.toString(),'base64','utf8');
    dec += decipher.final('utf8');
    logger.info("after decryptToken" + dec);
    return dec;
  }

  renderServiceLookup = (enrollment, requestInfo) => {
    let openAm = requestInfo.moodle.openAM;
    if(!requestInfo.moodle.openAM){
       let moodleName = requestInfo.moodle.host;
       let headerHost = moodleName.split("/")[0]+"//"+moodleName.split("/")[2]+"/"; 
       headerHost = headerHost.substring(0, 17) + 'tst' +headerHost.substring(20);
      openAm = headerHost;
      logger.info("inside called"+ openAm);
    }
    let guidStr = guid.raw().toString().replace(/-/g,'').substring(0, 24);
    enrollment.serviceLookup.push({"_id": guidStr, 'moodleHostName' : requestInfo.moodle.host, 'moodleopenAM' : openAm,'website' : Config.get('environment:URL')});
  }
}

let apputil = new AppUtil();
export default apputil;
