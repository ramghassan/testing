import UserModel from '../../models/user'
import SchoolUserModel from '../../models/schooluser'
import SAModel from '../../models/schooladministration'
import _ from 'lodash'
import GeoModel from '../../models/geo'
import logger from '../../logger'
import AppUtil from '../../utils/apputil'

class UserDelegate {
  getUserRole = (email) => {    
     let userPromise = UserModel.findOne({email:email})
     .then((data) => {
      if(!data) throw "This user is not authorized to use this application";
      return data;
     })
     .catch((err)=>{
      throw err;
     })
     return userPromise;
  }

  put = (body) => {
    let query = { email: body.email};
    let userInstance;
    let userPromise = UserModel.findOne(query)
    .then(function (user) {
      if(user === null) {
        userInstance = new UserModel(body);       
        return userInstance.save();
      }
      return user;
     })
     .catch(function(err) {       
       throw err;
     })
    return userPromise;
   } 

  getUserByEmail = (email) => {
    return UserModel.findOne({email:email}).exec();
   }

  getUserByuid= (uid) => {
    return UserModel.findOne({uid:uid}).exec();
   }

  isUserEnrolled = (uid) => {
    return SchoolUserModel.find({userId:uid}).exec()
    .then((data)=>{
      if(data.length >= 1) return true;
       return false; 
    })
    .catch((err)=>{
      throw err;
    })
  }


  getUserProfileWithSchools = (uid) => { 
     let schoolUserRes = [];        
     let userPromise = SchoolUserModel.find({userId:uid},{id:0})         
    .populate({ path:'schoolId',
                 select: 'name saId links'}).exec()     
     .then((schoolRes)=>{      
        schoolUserRes = schoolRes;       
       return UserModel.findOne({uid:uid}).exec();
     })
     .then( (userRes)=>{      
      schoolUserRes.push(userRes);            
       return schoolUserRes;
     })
     .catch((err)=>{
      throw err;
     })
     return userPromise;
  }

  getSchoolsByUserIds = (uids) => {    
    return SchoolUserModel.find({userId : {$in: uids}}) 
    .populate({ path:'schoolId',
                 select: 'name saId links'}).exec();    
  }

  getUsers = (uids) => {    
    return UserModel.find({uid : {$in: uids}}).exec();
  }

  getUser = (uid) => {     
     return UserModel.find({uid:uid}).exec();
  }

  getLinks = (links,said) => {    
    let keys = [];        
    let saLinks;
    let geoLinks;
    let schoolLinks = links.toObject();
    let saPromise = SAModel.findOne({_id:said}).exec()
    .then((sa) => {      
      saLinks = sa.links.toObject(); 
     return GeoModel.findOne({_id:sa.geoId}).exec()
    })
    .then( (geo)=>{      
      geoLinks = geo.links.toObject(); 
      keys = (Object.keys(saLinks).concat(Object.keys(geoLinks))).concat(Object.keys(schoolLinks));    
      keys = _.uniq(keys); 
      for(let index in keys){
        if(schoolLinks === null || typeof schoolLinks[keys[index]] === 'undefined' || !schoolLinks[keys[index]]) {        
        schoolLinks[keys[index]]= !saLinks[keys[index]] ? (!geoLinks[keys[index]] ? '' : geoLinks[keys[index]]) : saLinks[keys[index]];                   
      }
    }
       return schoolLinks;
    })
    .then( (schoolLinks)=>{   
      let linksKeys = Object.keys(schoolLinks);      
      if(linksKeys.length < 1) return null;
      else {
        for(let index in linksKeys) {         
         if(!schoolLinks[linksKeys[index]]) {         
         delete schoolLinks[linksKeys[index]];  
         }
      }
         return schoolLinks;
      } 
    })
    .catch(function (err) {
      throw err;
    });     
     return saPromise;
  }
  
  getSchools = (uid) => {
    return SchoolUserModel.find({userId:uid},'-_id -uid -__v')
    .populate({ path: 'schoolId', select: 'name saId links _id'})
    .exec();
  }

}

export default UserDelegate;