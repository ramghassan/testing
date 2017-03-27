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
let said = "56cc6937e4aedc686157cbbf";
let schoolName = "wongalethu"
let terms = "http://terms.com";
let privacy = "http://privacy.com";
let cookie = "http://cookie.com";
let moodle = "http://moodle.com";
let services = "http://services.com";
let website = "http://website.com";
let languagePack = "http://sss/languagepack.json";
let schoolid;
let geoidHK, geoidIndia;
let schoolAdminHK1, schoolAdminHK2, schoolAdminIndia1, schoolAdminIndia2;
let schoolHK1_1, schoolHK1_2, schoolHK2_1, schoolHK2_2, schoolIndia1_1, schoolIndia2_1;

let geoName1 = "HongKong";
let geoName2 = "India";

let schoolAdminNameHK1 = "schoolAdminHK1"; 
let schoolAdminNameHK2 = "schoolAdminHK2"; 
let schoolAdminNameIndia1 = "schoolAdminIndia1"; 
let schoolAdminNameIndia2 = "schoolAdminIndia2"; 

let schoolNameHK1_1 = "schoolHK1_1"; 
let schoolNameHK1_2 = "schoolHK1_2"; 
let schoolNameHK2_1 = "schoolHK2_1"; 
let schoolNameHK2_2 = "schoolHK2_2"; 


describe('Test User', function() {
  before((done) => {
    'use strict';
    mongoose.connection.collections['geo'].drop(function(err) {
      if (err) console.log("Error in dropping geo collection : " + err);
    });
    mongoose.connection.collections['schooladmin'].drop(function(err) {
      if (err) console.log("Error in dropping schooladmin collection : " + err);
    });
    mongoose.connection.collections['school'].drop(function(err) {
      if (err) console.log("Error in dropping school collection : " + err);
    });
    let userSession = {token : access_token};
      cacheUtil.addSessionToCache(server, userSession, 'pearson-admin')
      .then((cached) => {
        cacheUtil.getSessionFromCache(server, access_token)
        .then((val) => {
          console.log("val=====>", val);
           done();
        })
    }) 
  });

  //---------------- Insert Geo, SchoolAdmin, Schools ------------------------
   it('post or put Geo', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/geo",
            payload: {
              geo:[{
                "name": geoName1,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
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
            geoidHK = response.result._id;
            done();
          }
        });
    });


    it('post or put Geo with the same name', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/geo",
            payload: {
              geo:[{
                "name": geoName2,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
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
            geoidIndia = response.result._id;
            done();
          }
        });
    });

    //--------------- Insert School Admins ---------------------------------

    it('post or put SA with the same name', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/schooladmin",
            payload: {
              schoolAdmin:[{
                "name": schoolAdminNameHK1,
                "geoId" : geoidHK,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
                }
              }]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('post or put SA with the same name' + JSON.stringify(response.result));   
          if(response.result){
            schoolAdminHK1 = response.result._id;
            done();
          }
        });
    }); 

    it('post or put SA with the same name', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/schooladmin",
            payload: {
              schoolAdmin:[{
                "name": schoolAdminNameHK2,
                "geoId" : geoidHK,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
                }
              }]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('post or put SA with the same name' + JSON.stringify(response.result));   
          if(response.result){
            schoolAdminHK2 = response.result._id;
            done();
          }
        });
    }); 

    it('post or put SA with the same name', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/schooladmin",
            payload: {
              schoolAdmin:[{
                "name": schoolAdminNameIndia1,
                "geoId" : geoidIndia,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
                }
              }]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('post or put SA with the same name' + JSON.stringify(response.result));   
          if(response.result){
            schoolAdminIndia1 = response.result._id;
            done();
          }
        });
    }); 

    it('post or put SA with the same name', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/schooladmin",
            payload: {
              schoolAdmin:[{
                "name": schoolAdminNameIndia2,
                "geoId" : geoidIndia,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
                }
              }]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('post or put SA with the same name' + JSON.stringify(response.result));   
          if(response.result){
            schoolAdminIndia2 = response.result._id;
            done();
          }
        });
    }); 
     //--------------- Insert Schools ---------------------------------

   it('post or put school', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/school",
            payload: {
              school:[{
                "name": schoolNameHK1_1,
                "saId" : schoolAdminHK1,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
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
            schoolHK1_1 = response.result._id;
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
                "name": schoolNameHK1_2,
                "saId" : schoolAdminHK1,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
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
            schoolHK1_2 = response.result._id;
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
                "name": schoolNameHK2_1,
                "saId" : schoolAdminHK2,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
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
            schoolHK2_1 = response.result._id;
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
                "name": schoolNameHK2_2,
                "saId" : schoolAdminHK2,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
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
            schoolHK2_2 = response.result._id;
            done();
          }
        });
    });

/*    it('post or put school', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/school",
            payload: {
              school:[{
                "name": 'schoolIndia1_1',
                "saId" : schoolAdminIndia1,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
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
            schoolIndia1_1 = response.result._id;
            done();
          }
        });
    });

    it('post or put school', {timeout:6000},function(done) {
    var options = {
      method: "GET",
        url: "/school",
            payload: {
              school:[{
                "name": 'schoolIndia1_1',
                "saId" : schoolAdminIndia1,
                "links" : {
                  "terms" : terms,
                  "privacy" : privacy,
                  "cookie" : cookie,
                  "moodle" : moodle,
                  "services" : services,
                  "website" : website,
                  "languagePack" : languagePack
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
            schoolIndia1_1 = response.result._id;
            done();
          }
        });
    });*/


    it('get school by Geo', {timeout:6000},function(done) {
    var options = {
      method: "GET",
        url: "/school/geo/" + geoidHK,
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('get school' + JSON.stringify(response.result));   
          if(response.result){
            done();
          }
        });
    });

    it('get school by said', {timeout:6000},function(done) {
    var options = {
      method: "GET",
        url: "/school/schooladmin/" + schoolAdminHK1,
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('get school' + JSON.stringify(response.result));   
          if(response.result){
            done();
          }
        });
    });


it('get school by school Id', {timeout:6000},function(done) {
   var options = {
     method: "GET",
       url: "/school?schoolids="+schoolHK1_1,
           headers : {
             authorization : 'Bearer ' + access_token
           }
       };      
       server.inject(options, function(response) {
         console.log('get school' + JSON.stringify(response.result));   
         if(response.result){
           done();
         }
       });
   });
});