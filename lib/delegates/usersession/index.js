import userSessionModel from '../../models/usersession';
import _ from 'lodash';
import logger from '../../logger';
import Promise from 'bluebird';
import cacheUtil from '../../utils/cacheutil';

class UserSessionDelegate {
  createSession = (server, token, headers, user) => {   
    let query = {      
      userId:user.uid,
      deviceId : headers.deviceid,
      userAgent : headers['user-agent'],
      token : token,
      language : headers['accept-language'],
    }
    let updateData = _.clone(query, true);
    updateData.startTime = new Date().toISOString();
    let userSessionPromise = userSessionModel.findOneAndUpdate(query, updateData, {upsert: true, new :true})
    .then(userSession => {
      return cacheUtil.addSessionToCache(server, userSession, user.roleValue);
    })
    .catch(err => {
      logger.error('error createSession', {filename: __filename, pid: process.pid, error: err.toString()});
      throw err;
    })
    return userSessionPromise;
  }
  
 removeSession = (token) => {
    return userSessionModel.remove({token:token}).exec();
  }
}
export default UserSessionDelegate;
