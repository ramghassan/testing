import Config from '../configuration';
import AuthUser from './auth/authuser';
import Hapi from 'hapi';
import inert from 'inert';
import vision from 'vision';
import pack from '../../../package.json';
import blipp from 'blipp';
import fs from 'fs';
import db from '../db';
import Boom from 'boom';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = Config.get('hapi:tlsRejectUnauthorized');

let server = new Hapi.Server({
  cache: [
    {
      name: 'redisCache',
      engine: require('catbox-redis'),
      host: Config.get('redis:host'),
      port: Config.get('redis:port'),
      partition: 'web-cache',
      password: Config.get('redis:password'),
    }
  ]
});

server.method('isAuthenticatedUser', isAuthenticatedUser, {
  cache: {
    cache: 'redisCache',
    expiresIn: 86400000,
    generateTimeout: 100
  },
  generateKey: function (token) {
        return (token);
  }
});


function isAuthenticatedUser(token, resp, done){
  console.info("isAuthenticatedUser :"+ token);
  return done(null, resp);
}

server.connection({
  port: Config.get('hapi:port'),
  routes: {
    cors: {
      origin : ['*'],
      headers : ['Authorization', 'Content-Type', 'If-None-Match', 'appid', 'token']
    }
  },
  tls: {
    key: fs.readFileSync('/opt/pulseServers/cert/domain.key', 'utf8'),
    cert: fs.readFileSync('/opt/pulseServers/cert/domain.crt', 'utf8')
  }
});

server.register(require('hapi-auth-bearer-token'), function (err) {
    server.auth.strategy('bearer', 'bearer-access-token', AuthUser);
});


server.ext('onRequest', function (request, reply) {
    var userAgent = request.headers['user-agent'];
    if(request.url.path == '/') {
      reply.continue();
    }

    else if (request.headers['x-forwarded-proto'] === 'http') {
      reply.redirect('https://' + request.headers.host +
                      request.url.path).code(301);
      return reply.continue();
    }

    else if(request.url.path.indexOf('/docs') < 0 ) {

        if(!request.headers['deviceid']){
          reply(Boom.methodNotAllowed('deviceid header not present'));
        }

        else if(!request.headers['appversion']){
          reply(Boom.methodNotAllowed('appVersion header not present'));
        }

        else if(!request.headers['user-agent']){
          reply(Boom.methodNotAllowed('user-agent header not present'));
        }

        else if(!request.headers['accept-language']){
          reply(Boom.methodNotAllowed('accept-language header not present'));
        } else {
          reply.continue();
        }
     }
  else {
    reply.continue();
  }

});

let routes = require('../routes/index');
server.route(routes);

let options = {
  opsInterval: 1000,
  reporters: [{
    reporter: require('good-console'),
    events: { log: '*', response: '*' }
  },{
    reporter: require('good-file'),
    events: {
      response: '*',
      error:'*',
      log: '*'
    },
    config: {
      path: Config.get('hapi:logs'),
      rotate: 'daily',
      prefix : 'node-pulse-api'
    }
  }]
};

server.register({
    options: options,
    register: require('good'),
}, function (err) {
    if (err) {
        console.error(err);
    }
});

// setup swagger options
var swaggerOptions = {
  apiVersion: pack.version,
  basePath: Config.get('swagger:baseURL'),
  info: {
    title: 'GAB API documentation',
    description: 'GAB API consumed by Pulse Web & Mobile.',
  }
};

server.register([
  inert,
  vision,
  blipp,
  {
    register: require('hapi-swagger'),
    options: swaggerOptions
  }
  ], function (err) {
      if(err) {
        console.error(err);
      }

      server.start(function(){
          console.log('Server running at:', server.info.uri);
      });
});

// add templates support with handlebars for swagger
server.views({
  path: 'templates',
  engines: { html: require('handlebars') },
  partialsPath: './templates/withPartials',
  helpersPath: './templates/helpers',
  isCached: false
})

export { server };
