import Lab from 'lab';
import Code from 'code';
import mongoose from 'mongoose';
import cacheUtil from '../../dist/lib/utils/cacheutil'

let server = require('../../dist/lib/server/testServer.js').server;
let lab = exports.lab = Lab.script();
let describe = lab.describe;
let before = lab.before;
let after = lab.after;
let it = lab.it;
let expect = Code.expect;

let access_token = 'MOCK865d-d8ab-4063-a089-c6c222eaed9d';
let access_token_user='MOCK865d-d8ab-4063-a089-c6c222eaed9r';
let adminEmailId = 'pearsonadmin@pearson.com';
let userEmailId = 'pulse.t2@anymail.com';
let geoName = "Australia";
let schoolName1="school01";
let schoolName2="school02";
let saName="Telcom";
let geoid,said,userId,schoolId1,schoolId2;

describe('Test User Profile', function() {

  before((done) => {
    'use strict';
    let userSession = {token : access_token};
    cacheUtil.addSessionToCache(server, userSession, 'pearson-admin')
    .then((cached) => {
      cacheUtil.getSessionFromCache(server, access_token)
      .then((val) => {
        console.log("val=====>", val);
        done();
      })  
   });
});

  it('post or put Geo', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/geo",
            payload: {
              geo:[{
                "name": geoName,
                "links" : {
                      "terms" : "https://ausi.pearson.com/Pulse-learning-management-platform-terms-of-use.html",
                      "privacy" : "https://ausi.pearson.com/Pulse-learning-management-platform-privacy-policy.html"                      
                       }              
              }]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('post or put Geo :' + JSON.stringify(response.result));   
          if(response.result._id){
            geoid = response.result._id;
            done();
          }
        });
    });

  it('post or put SA', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/schoolsadministration",
            payload: {
              schoolAdmin:[{
                "name": saName,
                "geoId" : geoid,
                "links" : {                      
                      "cookie" : "https://www.pearson.com/cookie-policy.html",
                      "moodle" : "http://pulse-ausi-stg.pearsoned.com11"                      
                       }
              }]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('post or put SA' + JSON.stringify(response.result));   
          if(response.result._id){
            said = response.result._id;
            done();
          }
        });
    });

  it('post or put school', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/school",
            payload: {
              school:[{
                "name": schoolName1,
                "saId" : said,
                "links" : {                      
                      "services" : "https://pulse-ausi-prd-api.noip.me:400011",
                      "website" : "https://pulse-ausi-prd.noip.me11",
                      "languagePack" : "https://pulse-ausi-prd.noip.me11/languagePack.json"
                       }
              }]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('post or put school' + JSON.stringify(response.result));   
          if(response.result._id){            
            schoolId1= response.result._id;
            done();
          }
        });
    });
 
  it('post or put school', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/school",
            payload: {
              school:[{
                "name": schoolName2,
                "saId" : said,
                "links" : {                     
                      "services" : "https://pulse-ausi-prd-api.noip.me:400011",
                      "website" : "https://pulse-ausi-prd.noip.me11",
                      "languagePack" : "https://pulse-ausi-prd.noip.me11/languagePack.json"
                       }
              }]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('post or put school' + JSON.stringify(response.result));   
          if(response.result._id){            
            schoolId2 = response.result._id;
            done();
          }
        });
    });

  it('post or put an user and should be saved successfully', {timeout:6000}, function(done) {   
    var options = {
      method: "PUT",
        url: "/user",
            payload: {
                user:[
                  {
                    "name": "pulse.t2",
                    "username":"pulse.t2",
                    "password":"secret12",
                    "email": userEmailId,
                    "fName":"pulset2",
                    "lName": "t2",
                    "thumbnail": "http://url.com"                    
                  }
                ]
            },
            headers : {
              authorization : 'Bearer ' + access_token              
            }
        };      
        server.inject(options, function(response) {
          console.log('final' + JSON.stringify(response.result));
            userId = response.result.uid;
            console.log('UserId set' , userId);
            expect(response.result.email).to.equal(options.payload.user[0].email);
            done();
        });     
    });



  it('getprofile', function(done) {   
    var options = {
      method: "GET",
        url: "/user",
            headers : {
              authorization : 'Bearer ' + access_token_user              
            }
        };      
        server.inject(options, function(response) {   
         console.log('Get Profile response =====' + response);       
          expect(response.result).to.not.equal(null);
          //expect(response.result[0].links.languagePack).to.not.equal(null);          
          done();       
        });
  });

  it('getprofile', function(done) {   
    var options = {
      method: "GET",
        url: "/user?id="+userId,
            headers : {
              authorization : 'Bearer ' + access_token              
            }
        };      
        server.inject(options, function(response) {   
         console.log('Get Profile response =====' + response);       
          expect(response.result).to.not.equal(null);
          //expect(response.result[0].links.languagePack).to.not.equal(null);          
          done();       
        });
  });

  it('isValidToken', function(done) {   
    var options = {
      method: "GET",
        url: "/user/isTokenValid?id="+userId,
            headers : {
              authorization : 'Bearer ' + access_token_user              
            }
        };      
        server.inject(options, function(response) {   
         console.log('isToken Valid' + response.result);       
          expect(response.result.valid).to.not.equal(false);          
          done();       
        });
  });

  it('isValidToken', function(done) {   
    var options = {
      method: "GET",
        url: "/user/isTokenValid?id=invalid",
            headers : {
              authorization : 'Bearer ' + access_token_user              
            }
        };      
        server.inject(options, function(response) {   
         console.log('isToken Valid false scenario' + JSON.stringify(response));       
          expect(response.result.statusCode).to.equal(405);          
          done();       
        });
  });

    it('Enrolluser', function(done) {
    var options = {
      method: "PUT",
        url: "/school/enrolluser",
            payload: {
                enrollment:[
                  {
                    "userId": userId,
                    "schoolId": schoolId1,
                    "roleValue": "teacher"
                  }
                ]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
      server.inject(options, function(response) { 
      console.log('User id ---' , userId);
      let userSession = {token : access_token_user,userId:userId};
        cacheUtil.addSessionToCache(server, userSession, '')
        .then((cached) => {
          cacheUtil.getSessionFromCache(server, access_token_user)
          .then((val) => {
            console.log("val for user=====>", val);            
        })  
     });
      if(response.result._id){
           expect(response.result._id).to.not.equal(null);
           done();
         }
      });
      
    });

  it('Enrolluser', function(done) {
    var options = {
      method: "PUT",
        url: "/school/enrolluser",
            payload: {
                enrollment:[
                  {
                    "userId": userId,
                    "schoolId": schoolId2,
                    "roleValue": "teacher"
                  }
                ]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('User id ---' , userId);
          console.log('Enrolluser ' + JSON.stringify(response.result));   
          if(response.result._id){
            expect(response.result._id).to.not.equal(null);
             done();
          }
        });

    });

  it('logout', function(done) {   
    var options = {
      method: "GET",
        url: "/user/logout",
            headers : {
              authorization : 'Bearer ' + access_token_user              
            }
        };      
        server.inject(options, function(response) {            
          expect(response.result).to.not.equal(null);          
          done();       
        });
  });
  
after((done) => {
  'use strict'; 
  mongoose.connection.collections['school'].remove({"name":schoolName1}, function(err) {
      if (err) console.log("Error in dropping school collection : " + err);    
    });
    mongoose.connection.collections['school'].remove({"name":schoolName2}, function(err) {
      if (err) console.log("Error in dropping school collection : " + err);    
    });  
     mongoose.connection.collections['geo'].remove({"name":geoName}, function(err) {
      if (err) console.log("Error in dropping geo collection : " + err);      
    });
    mongoose.connection.collections['schooladmin'].remove({"name":saName}, function(err) {
      if (err) console.log("Error in dropping schooladmin collection : " + err);     
    });   
    mongoose.connection.collections['user'].remove({"email":userEmailId}, function(err) {
      if (err) console.log("Error in dropping school collection : " + err);    
    }); 
  mongoose.connection.collections['schooluser'].remove({"userId":userId}, function(err) {
     if (err) console.log("Error in removing user in user collection : " + err);              
  });
  cacheUtil.dropSessionFromCache(server, access_token)
      .then((cached) => {
        console.log('dropped --->' + cached);
  });  
  cacheUtil.dropSessionFromCache(server, access_token_user)
      .then((cached) => {
        console.log('dropped --->' + cached);
  });
});

});