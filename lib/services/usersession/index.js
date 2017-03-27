import logger from '../../logger';
import UserDelegate from '../../delegates/user';
import UserSessionDelegate from '../../delegates/usersession';

class UserSessionService {
  constructor() {    
    this.userSessionDelegate   = new UserSessionDelegate();
    this.userDelegate = new UserDelegate();
  }

  createSession = (server, token, headers, uid) => {
    let promise = this.userDelegate.getUserByuid(uid)
    .then(user => {
      if(!user){
        throw new Error("user with email " + uid + " does not exist in database");
      }
      return this.userSessionDelegate.createSession(server, token, headers, user);   
    })
    .catch(err => {
      logger.error('error createSession', {filename: __filename, pid: process.pid, error: err.toString()});
      throw err;
    })
    return promise;
  }

 removeSession = (token) => {    
    let promise = this.userSessionDelegate.removeSession(token)
    .then(response => {      
      if(!response){
        throw new Error("Error in removing user session");
      }      
      return response;
    })
    .catch(err => {
      logger.error('error removeSession', {filename: __filename, pid: process.pid, error: err.toString()});
      throw err;
    })
    return promise;
  }
}

export default UserSessionService;

