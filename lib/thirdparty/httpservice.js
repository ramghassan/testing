import Config from '../configuration';
import Http from 'http-as-promised';
import logger from '../logger';
import Promise from 'bluebird';


class HttpService {
  postService = (url, headers, data,json) => {    
    var deferred = Promise.pending();
    let request = Http(url, {
      method: 'POST',
      resolve: ['body', 'response'],
      headers: headers,
      data: data,
      json: {
          'username': json.username,
          'userpassword': json.password,
          'mail': json.email
       }
    });    
    request.nodeify((err, rawResponse) => {
      if(err){
      logger.info('HttpService Foregerock Err', err); 
        deferred.reject(err);
      }
      else{
        let response = rawResponse ? rawResponse: rawResponse;  
       logger.info('HttpService Foregerock Response', response);
        deferred.resolve(response);
      }
    }, {spread: true});
    return deferred.promise;
  } 
}
export default HttpService;

