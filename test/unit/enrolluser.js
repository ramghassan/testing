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
let userId = "56cae24d8892d34c347cc93d";
let schoolId = "56d00399164bc3261920269f";

describe('Test User', function() {
  before((done) => {
    'use strict';
    mongoose.connection.collections['schooluser'].remove({"userid":userId}, function(err) {
      if (err) console.log("Error in dropping schooluser collection : " + err);
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

  it('Enrolluser success', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/school/enrolluser",
            payload: {
                enrollment:[
                  {
                    "userId": userId,
                    "schoolId": schoolId,
                    "roleValue": "teacher"
                  }
                ]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('Enrolluser ' + JSON.stringify(response.result));   
          if(response.result._id){
            done();
          }
        });
    });
    
    it('Enrolluser return null when it happen again for same school', {timeout:6000},function(done) {
    var options = {
      method: "PUT",
        url: "/school/enrolluser",
            payload: {
                enrollment:[
                  {
                    "userId": userId,
                    "schoolId": schoolId,
                    "roleValue": "teacher"
                  }
                ]
            },
            headers : {
              authorization : 'Bearer ' + access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('Enrolluser return null when it happen again for same school' + JSON.stringify(response.result));   
          if(response.result == null){
            done();
          }
        });
    });
});
