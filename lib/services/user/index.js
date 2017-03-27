import UserDelegate from '../../delegates/user'
import logger from '../../logger';
import _ from 'lodash';
import AppUtil from '../../utils/apputil';

class UserService {
  constructor() {
    this.userDelegate = new UserDelegate();    
  }

  getUserRole = (email) => {        
    return this.userDelegate.getUserRole(email);
  }

  put = (payload) => {       
    let userCreationPromise = this.userDelegate.put(payload)
    .then((response) => {
      return response;
    })
    .catch(function(err){
      logger.error('error user service' + JSON.stringify(err));
      throw err;
    })
    return userCreationPromise;
  }


  getProfile = (uid) => {
    logger.info('In User getProfile Service' , uid);    
    let userPromise = this.userDelegate.isUserEnrolled(uid)
    .then((response) => {
      logger.info('In User getProfile Service' , response);    
      if(response) return this.getUserprofileWithSchools(uid);
      return this.getUser(uid);
    }) 
    .catch(function(err){
      logger.error('error in user getProfile service' + JSON.stringify(err));
      throw err;
    })   
    return userPromise;
  }

  getUsersProfile = (ids) => {
    logger.info('In Users getProfile Service' , ids);              
       let userResp = [];
       let schoolsRespPromises = [];
       let serviceRes = [];
       let promiseArr = [];
       let userSchoolPromise = this.userDelegate.getUsers(ids)
       .then((userRes) => {          
          userResp = userRes;
          return this.userDelegate.getSchoolsByUserIds(ids)
       })
       .then((schoolsRes)=>{                                  
         _.each(userResp,(user) => {
           let userDet = {};                            
            _.each(schoolsRes,(schRes) => {                             
              if(schRes.userId === user.uid) { 
                  userDet.schools = [];
                  let school = {}; 
                  userDet.id=user.id,
                  userDet.name = user.name,
                  userDet.fName = user.fName,
                  userDet.lName = user.lName,
                  userDet.email = user.email,
                  userDet.thumbnail = user.thumbnail,  
                  userDet.uid = user.uid,
                  userDet.username = user.username;  
                  school.id= schRes.schoolId.id,
                  school.name = schRes.schoolId.name,
                  school.saId = schRes.schoolId.saId,
                  school.roleValue = schRes.roleValue;
        let linksPromise = this.userDelegate.getLinks(schRes.schoolId.links,schRes.schoolId.saId)
        .then((links)=>{                                            
            if(links !== null){school.links = links;} 
            userDet.schools.push(school); 
            return userDet;           
            })    
            promiseArr.push(linksPromise);          
            } 
            })           
            let schoolLinksPromise =  Promise.all(promiseArr)
            .then((response)=>{                
                return response;                
              }) 
            .then((response) => {              
              serviceRes.push(userDet);
              return response;
            })
            schoolsRespPromises.push(schoolLinksPromise); 
         }) 
        return Promise.all(schoolsRespPromises)
            .then(userSchools => {              
              return serviceRes;
            })
       })     
 .catch(function(err){
      logger.error('error in user getUserprofileWithSchools service' + JSON.stringify(err));
      throw err;
    }) 
    return userSchoolPromise;
  }

  getUserprofileWithSchools = (uid) => {  
  let userPromise = this.userDelegate.getUserProfileWithSchools(uid)
    .then( (response) => {     
    let promiseArr = []; 
    let serviceRes = {};
      serviceRes.schools = [];            
      _.each(response, (arg) => {                              
        let school = {};              
       if(typeof arg.username !== 'undefined' || arg.username){         
        serviceRes.id=arg.id,
        serviceRes.name = arg.name,
        serviceRes.fName = arg.fName,
        serviceRes.lName = arg.lName,
        serviceRes.email = arg.email,
        serviceRes.thumbnail = arg.thumbnail,  
        serviceRes.uid = arg.uid,
        serviceRes.username = arg.username;  
        } 
        else{
        school.id= arg.schoolId.id,
        school.name = arg.schoolId.name,
        school.saId = arg.schoolId.saId,
        school.roleValue = arg.roleValue;
        let linksPromise = this.userDelegate.getLinks(arg.schoolId.links,arg.schoolId.saId)
        .then((links)=>{           
            if(links !== null){school.links = links;}               
            serviceRes.schools.push(school);
            return serviceRes;
        })
       promiseArr.push(linksPromise); 
     }
      })
      return Promise.all(promiseArr)
     .then((response)=>{          
        return response[0];
      })
    })
    .catch(function(err){
      logger.error('error in user getUserprofileWithSchools service' + JSON.stringify(err));
      throw err;
    })  
    return userPromise; 
  }

  getUser = (uid) => {
     logger.info('In User getUser Service' , uid);    
    let userPromise = this.userDelegate.getUser(uid)
    .then((userRes) => {
      let serviceRes = {}; 
         _.each(userRes, (user) => {        
        serviceRes.id = user.id,
        serviceRes.name = user.name,
        serviceRes.fName = user.fName,
        serviceRes.lName = user.lName,
        serviceRes.email = user.email,
        serviceRes.uid = user.uid,
        serviceRes.username = user.username,  
        serviceRes.thumbnail = user.thumbnail;
        user.roleValue ? serviceRes.roleValue=user.roleValue : '';
    })
      return serviceRes;
   })
    .catch(function(err){
      logger.error('error in user getProfile service' + JSON.stringify(err));
      throw err;
    })   
    return userPromise;
  }

  getSchools = (uid) => {
    let promiseArr = [];
    let userPromise = this.userDelegate.getSchools(uid)
    .then((response) => {
      console.log('Response---', response);
      let serviceRes = [];   
      _.each(response, (arg) => {
        let school = {};  
        console.log('Arg---', arg);    
        school.id= arg.schoolId.id,
        school.name = arg.schoolId.name,
        school.saId = arg.schoolId.saId,
        school.roleValue = arg.roleValue;       
        let linkPromise = this.userDelegate.getLinks(arg.schoolId.links,arg.schoolId.saId)
        .then((links)=>{ 
          if(links !== null){school.links = links;}                         
          serviceRes.push(school);
          return serviceRes;
        });
        promiseArr.push(linkPromise);             
      });
      return Promise.all(promiseArr)
      .then((response)=>{           
        return response[0];
     })
    })
    .catch(function(err){
      logger.error('error in user getSchools service' + JSON.stringify(err));
      throw err;
    })
    return userPromise;
  } 
}

export default UserService;