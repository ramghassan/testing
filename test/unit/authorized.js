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
let originId = "0677821c-e903-41a4-9bb0-d784aafd535c";


describe('Test api to check if a user is authorized for an asset', function() {

  before((done) => {
    'use strict';
    let userSession = {token : access_token, userId : "sathya_testing"};
      cacheUtil.addSessionToCache(server, userSession, 'pearson-admin')
      .then((cached) => {
        cacheUtil.getSessionFromCache(server, access_token)
        .then((val) => {
          console.log("val=====>", val);
          done();
        })
    }) 
  });

 it('is user can access the asset', {timeout:6000},function(done) {
    var options = {
      method : "GET",
        url : " /asset/authorized",
        headers : {
              authorization : 'Bearer ' + access_token,
              assetId : originId,
              token : access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('is user can access the asset :' + JSON.stringify(response.result));   
          if(response.result){
            done();
          }
        });
    });

 /*it('is user can access the asset - wrong asset', {timeout:6000},function(done) {
    var options = {
      method : "GET",
        url : " /asset/authorized",
        headers : {
              authorization : 'Bearer ' + access_token,
              assetId : "originId",
              token : access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('is user can access the asset : - wrong asset' + JSON.stringify(response.result));   
          if(response.result.message){
            done();
          }
        });
    });

  it('is user can access the asset - wrong UserId', {timeout:6000},function(done) {
    var options = {
      method : "GET",
        url : " /asset/authorized",
        headers : {
              authorization : 'Bearer ' + access_token,
              assetId : originId,
              token : access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('is user can access the asset : - wrong UserId' + JSON.stringify(response.result));   
          if(response.result.message){
            done();
          }
        });
    });

    it('is user can access the asset -if the user is not enrolled in the school', {timeout:6000},function(done) {
    var options = {
      method : "GET",
        url : " /asset/authorized",
        headers : {
              authorization : 'Bearer ' + access_token,
              assetId : originId,
              token : access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('is user can access the asset : - if the user is not enrolled in the school' + JSON.stringify(response.result));   
          if(response.result.message){
            done();
          }
        });
    });

    it('is user can access the asset -The school, the user enrolled dont have the assetId', {timeout:6000},function(done) {
    var options = {
      method : "GET",
        url : " /asset/authorized",
        headers : {
              authorization : 'Bearer ' + access_token,
              assetId : "dsf8dfslkfjksj-f",
              token : access_token
            }
        };      
        server.inject(options, function(response) {
          console.log('is user can access the asset : - The school, the user enrolled dont have the assetId' + JSON.stringify(response.result));   
          if(response.result.message){
            done();
          }
        });
    });*/
});