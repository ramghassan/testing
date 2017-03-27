'use strict';

var _ = require('underscore');
var Hapi = require('hapi');
var Joi = require('joi');
var ignore = /.DS_Store$/;
var requireDirectory = require('require-directory');
var routes = requireDirectory(module, __dirname, ignore);

var externalResources = ['/user/{resource}/provision', '/product/{resource}/{id}'];

var routesArray = _.flatten(_.map(routes, function (route) {
  _.each(route.routes, function (endpoint) {
    if (_.contains(externalResources, endpoint.path)) return;
    if (endpoint.config) {
      endpoint.config.validate = endpoint.config.validate || {};
      endpoint.config.validate.query = endpoint.config.validate.query || {};

      if (endpoint.path === '/authenticate') {
        endpoint.config.validate.headers = Joi.object({
          //'appid': Joi.string().required()
        }).unknown();
      }
    }
  });
  return route.routes;
}));

module.exports = routesArray;