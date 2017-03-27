import Promise from 'bluebird';
import _ from 'lodash';

class CacheUtil {

  dropSessionFromCache = (server, token) => {
    let deferred = Promise.pending();
    server.methods.isAuthenticatedUser.cache.drop(token, function (err, resp) {
      if(err) {
        deferred.reject("Unable to drop userSession object from cache for the token " + token + " " + err);
      }
      deferred.resolve(true);          
    })
    return deferred.promise;
  }

  addSessionToCache = (server, userSession, roleValue) => {
    let deferred = Promise.pending();
    if(!userSession){
      deferred.reject("Unable to update cache - userSession object is null or undefined: " + userSession);
    }
    let userSessionData = this.getTrimmedUserSession(userSession, roleValue);
    server.methods.isAuthenticatedUser(userSessionData.token || '', userSessionData, function (err, resp) {
      if(err){
        deferred.reject("Unable to update cache for the userSession object  " + err);  
      }
      deferred.resolve(resp);
    })
    return deferred.promise;
  }

  getSessionFromCache = (server, token) => {
   let deferred = Promise.pending();
    server.methods.isAuthenticatedUser(token, null, function (err, resp) {
      if(err){
        deferred.reject("Unable to get the userSession object  " + err);  
      }
      deferred.resolve(resp);
    })
    return deferred.promise; 
  }

  getTrimmedUserSession = (userSession, roleValue) => {
    console.log('get getTrimmedUserSession' + JSON.stringify(userSession));
    return {
      userId     :  userSession.userId,     
      deviceId   :  userSession.deviceId,
      token      :  userSession.token,
      startTime  :  userSession.startTime,
      userAgent  :  userSession.userAgent,
      language   :  userSession.language,
      roleValue  :  roleValue
    };
  }
}

let cacheUtil = new CacheUtil();
export default cacheUtil;
