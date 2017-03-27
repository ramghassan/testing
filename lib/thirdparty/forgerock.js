import Config from '../configuration';
import Http from 'http-as-promised';
import HttpService from './httpservice';
let authenticateUrl = Config.get('services:idm:authURL');
import ServiceResponse from '../services/ServiceResponse';


class ForgeRockService extends HttpService {
  /*To Do */
  constructor() { 
    super();   
    this.httpService = new HttpService();    
  }

  login = (payload, done) => {
    let loginHeaders =  {
      'X-OpenAM-Username': payload.username,
      'X-OpenAM-Password': payload.password,
      'Content-Type': 'application/json'
    }
    return this.httpService.postService(authenticateUrl, loginHeaders, {},{});
  }

 logout = (token) => {
  let logOutUrl = Config.get('services:idm:logoutURL')+'/'+token+"?_action=logout";  
  let sessionKeyName = Config.get('services:idm:sessionKeyName'); 
  let headers = {};
      headers[sessionKeyName] = token;
      headers['Content-Type'] = 'application/json';
   return this.httpService.postService(logOutUrl, headers, {},{});
 }

 isTokenValid = (token) => {
  let validateTokenUrl = Config.get('services:idm:logoutURL')+'/'+token+"?_action=validate";   
  let headers = {       
        'Content-Type': 'application/json'
      };  
   return this.httpService.postService(validateTokenUrl, headers, {},{});
 }

 createUser = (user) => {
  let authUrl = Config.get('services:idm:authURL');    
  let username = Config.get('services:idm:X-OpenAM-Username'); 
  let password = Config.get('services:idm:X-OpenAM-Password');
  let createUrl = Config.get('services:idm:createURL');  
  let sessionKeyName = Config.get('services:idm:sessionKeyName'); 
  let authHeaders =  {
      'X-OpenAM-Username': username,
      'X-OpenAM-Password': password,
      'Content-Type': 'application/json'
    }
   let createHeaders = {};        
        createHeaders['Content-Type'] = 'application/json';            
  let userCreationPromise = this.httpService.postService(authUrl, authHeaders, {},{})
  .then((response) => {
      if(response.tokenId) {        
        //call create user
        createHeaders[sessionKeyName] = response.tokenId;        
        return this.httpService.postService(createUrl, createHeaders, {},user); 
      }
      return new ServiceResponse(err.body,'Error in creating forgerock',null); 
  })
  .then((response)=>{    
   return new ServiceResponse(null,null,response); 
  })
  .catch((err)=>{     
    return new ServiceResponse(err.body,'Error in creating user in forgerock',null);
  })
   return userCreationPromise;
 }

}



export default ForgeRockService;