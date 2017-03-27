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
let geoID = "56d0023c5f5121b318020bb0";
let saName = "Telecom-lucid";
let said;
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
    mongoose.connection.collections['schoolsadministration'].remove({"name":saName}, function(err) {
      if (err) console.log("Error in dropping school admin collection : " + err);
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

  it('post or put SA', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/schoolsadministration",
            payload: {
              schoolAdmin:[{
                "name": saName,
                "geoId" : geoID,
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
    });

    it('post or put SA with the same name', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/schoolsadministration",
            payload: {
              schoolAdmin:[{
                "name": saName,
                "geoId" : geoID,
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
          console.log('PUT or put SA with the same name' + JSON.stringify(response.result));   
          if(response.result == null){
            done();
          }
        });
    }); 

    it('get all SA', {timeout:6000},function(done) {
    var options = {
      method: "GET",
        url: "/schoolsadministration?id=&geoId=",
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('get SA' + JSON.stringify(response.result));   
          done();
        });
    }); 

    it('get SA by ID', {timeout:6000},function(done) {
    var options = {
      method: "GET",
        url: "/schoolsadministration?id=56cee28ab70e8cf958c92b25,56cee30992716e5e5922147b&geoId=",
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('get SA' + JSON.stringify(response.result));   
          done();
        });
    });

    it('get SA by geoID', {timeout:6000},function(done) {
    var options = {
      method: "GET",
        url: "/schoolsadministration?id=&geoId=56d02cc26233ee7d1f0961f5",
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('get SA' + JSON.stringify(response.result));   
          done();
        });
    });

    it('get SA by id and geoID', {timeout:6000},function(done) {
    var options = {
      method: "GET",
        url: "/schoolsadministration?id=56d02ce16233ee7d1f0961f6&geoId=56d02cc26233ee7d1f0961f5",
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('get SA' + JSON.stringify(response.result));   
          done();
        });
    });
});