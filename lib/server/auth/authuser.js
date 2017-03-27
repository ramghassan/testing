import Boom from 'boom';
import reporter from 'good-console';
import logger from '../../logger';

export default {
  tokenType: 'Bearer',
  validateFunc: function (token, callback) {
		var request = this;
    var headers = request.raw.req.headers;
    logger.info("Inside validateFunc - token is : "+ token);
    request.server.methods.isAuthenticatedUser(token, null, function(err,resp){
      console.error('error ' + err + ' resp ' + resp);
      let isAuthenticated = false;
      if(resp) isAuthenticated = true;
      console.info('isAuthenticated ' + isAuthenticated);
      callback(null, isAuthenticated, {token: token});
    })
  }
};
