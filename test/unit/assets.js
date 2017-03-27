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

let geoName = "SA-lucid";
let geoId;
let terms = "http://terms.com";
let privacy = "http://privacy.com";
let cookie = "http://cookie.com";
let moodle = "http://moodle.com";
let services = "http://services.com";
let website = "http://website.com";
let languagePack = "http://sss/languagepack.json";

let saName = "Telecom";
let said;

let schoolName = "wongalethu"
let schoolId;

let name = "Additive and multiplicative inverses for integers"
let description = "Description for Additive and multiplicative inverses for integers"
let contentTypeValue = "video"
let fileType = "mp4"
let url = "https://eps.openclass.com/pulse-sa/api/item/0677821c-e903-41a4-9bb0-d784aafd535c/1/file/Additive_and_multiplicative_inverses_for_integers.mp4"
let thumbnailUrl = "http://sample/1.jpg";
let purposes = "teach"
let topic = "Maths"
let subtopic1 = "Algebra"
let subtopic1_1 = "Addition"
let section = "Algebra Section"
let originId = "0677821c-e903-41a4-9bb0-d784aafd535c"
let source = "eps"
let assetId;
let courseSectionId;


let originId1 = "0677821c-e903-41a4-9bb0-d784aafd535b"
let assetId1;

let courseName = "Maths Grade8A"
let thumbnail ="thumbnail.com"
let subject = "Maths"
let grade ="Grade8A"

let limitByRoles = "teacher"

describe('Test assets', function() {

  before((done) => {
    'use strict';
    mongoose.connection.collections['asset'].remove({"name":name}, function(err) {
      if (err) console.log("Error in dropping asset collection : " + err);
    });
    mongoose.connection.collections['asset'].remove({"lookUp.originId":originId1}, function(err) {
      if (err) console.log("Error in dropping asset collection : " + err);
    });
   mongoose.connection.collections['geo'].remove({"name":geoName}, function(err) {
      if (err) console.log("Error in dropping geo collection : " + err);
    });
   mongoose.connection.collections['schoolsadministration'].remove({"name":saName}, function(err) {
      if (err) console.log("Error in dropping school admin collection : " + err);
    });
   mongoose.connection.collections['school'].remove({"name":schoolName}, function(err) {
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

  it('post or put Geo', {timeout:6000},function(done) {
    var options = {
      method : "PUT",
        url : "/geo",
            payload : {
              geo :[{
                "name" : geoName,
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
            geoId = response.result._id;
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
                "geoId" : geoId,
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
          console.log('post or put SA' + JSON.stringify(response.result));   
          if(response.result._id){
            said = response.result._id;
            done();
          }
        });
    })

  it('post or put school', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/school",
            payload: {
              school:[{
                "name": schoolName,
                "saId" : said,
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
            schoolId = response.result._id;
            done();
          }
        });
    });

  it('post or put assets', {timeout:6000},function(done) {
    var options = {
      method : "PUT",
        url : "/asset",
            payload : {
              asset :[{
                "name" : name,
                "description" : description,
                "contentTypeValue" : contentTypeValue,
                "fileType" : fileType,
                "url" : url,
                "thumbnailUrl" : thumbnailUrl,
                "purposes" : ["teach"],
                "section" : section,
                "topic" : {
                  "name" : topic,
                  "subtopic" : {
                    "name" : subtopic1,
                    "subtopic" : {
                      "name" : subtopic1_1
                    }
                  }
                },
                "lookUp" : {
                  "originId" : originId,
                  "source" : source
                }
              }]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };
        server.inject(options, function(response) {
          console.log('post or put assets :' + JSON.stringify(response.result));   
          if(response.result.name == name){
            assetId = response.result.id;
            done();
          }
        });
    });
    
   it('post or put assets with same originId', {timeout:6000},function(done) {
    var options = {
      method : "PUT",
        url : "/asset",
            payload : {
              asset :[{
                "name" : name,
                "description" : description,
                "contentTypeValue" : contentTypeValue,
                "fileType" : fileType,
                "url" : url,
                "thumbnailUrl" : thumbnailUrl,
                "purposes" : ["teach"],
                "section" : section,
                "topic" : {
                  "name" : topic,
                  "subtopic" : {
                    "name" : subtopic1,
                    "subtopic" : {
                      "name" : subtopic1_1
                    }
                  }
                },
                "lookUp" : {
                  "originId" : originId,
                  "source" : source
                }
              }]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };
        server.inject(options, function(response) {
          console.log('post or put assets  with same URL:' + JSON.stringify(response.result));   
           if(response.result.message){
            done();
          }
        });
    });

    it('post or put assets with optional parameter', {timeout:6000},function(done) {
    var options = {
      method : "PUT",
        url : "/asset",
            payload : {
              asset :[{
                "name" : name,
                "description" : description,
                "contentTypeValue" : contentTypeValue,
                "fileType" : fileType,
                "url" : "http://optional.url.com",
                "thumbnailUrl" : "",
                "purposes" : [],
                "section" : "",
                "topic" : {
                  "name" : "",
                  "subtopic" : {
                    "name" : "",
                    "subtopic" : {
                      "name" : ""
                    }
                  }
                },
                "lookUp" : {
                  "originId" : originId1,
                  "source" : source
                }
              }]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };
        server.inject(options, function(response) {
          console.log('post or put assets  with optional parameter' + JSON.stringify(response.result));   
          if(response.result.name == name){
            assetId1 = response.result.id;
            done();
          }
        });
    });

    it('get asset by Ids', {timeout:6000},function(done) {
    var options = {
      method : "GET",
        url: "/asset?id="+assetId+","+assetId1,
            payload : {
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };
        server.inject(options, function(response) {
          console.log('get asset by Ids' + JSON.stringify(response.result));   
          if(!response.result.message){
            done();
          }
        });
    });
    it('post or put school asset', {timeout:6000},function(done) {
      var options = {
        method : "PUT",
          url : "/asset/school",
              payload : {
                assetSchool :[{
                  "schoolId" : schoolId,
                  "assetId" : assetId
                }]
              },
              headers : {
                authorization : 'Bearer ' + access_token
              }
            };
        server.inject(options, function(response) {
          console.log('post or put school asset :' + JSON.stringify(response.result));   
          if(response.result.assetId = assetId){
            done();
          }
        });
    });

    it('post or put school asset with the same asset and school id', {timeout:6000},function(done) {
      var options = {
        method : "PUT",
          url : "/asset/school",
              payload : {
                assetSchool :[{
                  "schoolId" : schoolId,
                  "assetId" : assetId
                }]
              },
              headers : {
                authorization : 'Bearer ' + access_token
              }
            };
        server.inject(options, function(response) {
          console.log('post or put school asset with the same asset and school id:' + JSON.stringify(response.result));   
          if(response.result.message){
            done();
          }
        });
    });

    it('post or put school asset with invalid assetId', {timeout:6000},function(done) {
      var options = {
        method : "PUT",
          url : "/asset/school",
              payload : {
                assetSchool :[{
                  "schoolId" : schoolId,
                  "assetId" : "56d59999def4fc5f0d114f0d"
                }]
              },
              headers : {
                authorization : 'Bearer ' + access_token
              }
            };
        server.inject(options, function(response) {
          console.log('post or put school asset with invalid assetId:' + JSON.stringify(response.result));   
          if(response.result.message){
            done();
          }
        });
    });
    it('post or put school asset with invalid school Id', {timeout:6000},function(done) {
      var options = {
        method : "PUT",
          url : "/asset/school",
              payload : {
                assetSchool :[{
                  "schoolId" : "56d59999def4fc5f0d114f0d",
                  "assetId" : assetId
                }]
              },
              headers : {
                authorization : 'Bearer ' + access_token
              }
            };
        server.inject(options, function(response) {
          console.log('post or put school asset with school assetId:' + JSON.stringify(response.result));   
          if(response.result.message){
            done();
          }
        });
    });

    it('get school asset by Ids and school ids', {timeout:6000},function(done) {
    var options = {
      method : "GET",
        url: "/asset/school?id="+assetId+","+assetId1+"&schoolId="+schoolId,
            payload : {
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };
        server.inject(options, function(response) {
          console.log('get school asset by Ids and school ids' + JSON.stringify(response.result));   
          if(!response.result.message){
            done();
          }
        });
    });
});