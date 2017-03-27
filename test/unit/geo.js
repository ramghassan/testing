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
let geoid;
let terms = "http://terms.com";
let privacy = "http://privacy.com";
let cookie = "http://cookie.com";
let moodle = "http://moodle.com";
let services = "http://services.com";
let website = "http://website.com";
let languagePack = "http://sss/languagepack.json";

describe('Test User', function() {

  before((done) => {
    'use strict';
    mongoose.connection.collections['geo'].remove({"name":geoName}, function(err) {
      if (err) console.log("Error in dropping geo collection : " + err);
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
            geoid = response.result._id;
            done();
          }
        });
  });
  it('post or put Geo with the same name', {timeout:6000},function(done) {
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
          console.log('post or put Geo with the same name' + JSON.stringify(response.result));   
          if(response.result == null){
            done();
          }
        });
    }); 
    it('get Geo by ID', {timeout:6000},function(done) {
    var options = {
      method: "GET",
        url: "/geo?id="+geoid,
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('get Geo' + JSON.stringify(response.result));   
            done();
        });
    });
    it('get all Geo', {timeout:6000},function(done) {
    var options = {
      method: "GET",
        url: "/geo?id=",
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('get Geo' + JSON.stringify(response.result));   
          done();
        });
    }); 
});