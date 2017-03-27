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
let emailId = 'pearsonadmin@pearson.com';
let usrEmailId='pearsonadmin@pearson.com'
let userId;

describe('Test User', function() {
  before((done) => {
      console.log('Test Server running at:', server.info.uri);
     'use strict';
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
  
  it('post or put an user and should be saved successfully', function(done) {
   console.log('Put user Test Case----');
    var options = {
      method: "PUT",
        url: "/user",
            payload: {
                user:[
                  {
                    "name": "TestUser",
                    "email": usrEmailId,
                    "fName":"TestFname",
                    "lName": "TestLname",
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
            expect(response.result.email).to.equal(options.payload.user[0].email);           
            done();
        });
  });

  it('getmyschools', function(done) {
    var options = {
      method: "GET",
        url: "/user/schools",
            headers : {
              authorization : 'Bearer ' + access_token              
            }
        };      
        server.inject(options, function(response) {
          console.log('getmyschools ' + JSON.stringify(response.result));
          expect(response.result).to.not.equal(null);
          done();       
        });
  });

after((done) => {
  'use strict';   
  mongoose.connection.collections['user'].remove({"email":usrEmailId}, function(err) {
     if (err) console.log("Error in removing user in user collection : " + err);
     done();           
  });      
});

});
