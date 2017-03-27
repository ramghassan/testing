import Lab from 'lab';
import Code from 'code';
import mongoose from 'mongoose';

let server = require('../../dist/lib/server/testServer.js').server;

let lab = exports.lab = Lab.script();
let describe = lab.describe;
let before = lab.before;
let after = lab.after;
let it = lab.it;
let expect = Code.expect;

describe('Test Authenticate', function() {
  before((done) => {
    'use strict';
     done();
  });
  
  it('authenticate successfully & save the session', function(done) {
    var options = {
      method: "POST",
        url: "/authenticate",
            payload: {
              "username": "pearsonadmin@pearson.com",
              "password": 'secret12',
            },
            headers : {
              deviceId : 'Lenovo-6010',
              language :  Date.now()
            }
        };      
        server.inject(options, function(response) {
          console.log('output token is' + JSON.stringify(response.result));
          expect(response.result).to.exist();
          done();
        });
  });

  after((done) => {
   done();  
  });      
});