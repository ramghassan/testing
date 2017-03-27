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
let said = "56d002da88e0b8d81864769a";
let schoolName = "wongalethu-lucid"
let schoolid;
let terms = "http://termsschool.com";
let privacy = "http://privacyschool.com";
let cookie = "http://cookieschool.com";
let moodle = "http://moodleschool.com";
let services = "http://servicesschool.com";
let website = "http://websiteschool.com";
let languagePack = "http://sss/languagepackschool.json";

describe('Test User', function() {
  before((done) => {
    'use strict';
    mongoose.connection.collections['school'].remove({"name":schoolName}, function(err) {
      if (err) console.log("Error in dropping school collection : " + err);
      done();
    });
    let userSession = {token : access_token};
      cacheUtil.addSessionToCache(server, userSession, 'pearson-admin')
      .then((cached) => {
        cacheUtil.getSessionFromCache(server, access_token)
        .then((val) => {
          console.log("val=====>", val);
        })
    }) 
  });

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
            schoolid = response.result._id;
            done();
          }
        });
    });

    it('post or put school with the same name', {timeout:6000},function(done) {
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
          console.log('post or put school with the same name' + JSON.stringify(response.result));   
          if(response.result == null){
            done();
          }
        });
    }); 

  /*it('get school', {timeout:6000},function(done) {
    var options = {
      method : "GET",
        url : "/school/" + schoolid,
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('get school' + JSON.stringify(response.result));   
          if(response.result.name == schoolName){
            done();
          }
        });
  });*/
});