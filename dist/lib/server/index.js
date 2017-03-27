'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _configuration = require('../configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _authAuthuser = require('./auth/authuser');

var _authAuthuser2 = _interopRequireDefault(_authAuthuser);

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _inert = require('inert');

var _inert2 = _interopRequireDefault(_inert);

var _vision = require('vision');

var _vision2 = _interopRequireDefault(_vision);

var _packageJson = require('../../../package.json');

var _packageJson2 = _interopRequireDefault(_packageJson);

var _blipp = require('blipp');

var _blipp2 = _interopRequireDefault(_blipp);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = _configuration2['default'].get('hapi:tlsRejectUnauthorized');

var server = new _hapi2['default'].Server({
  cache: [{
    name: 'redisCache',
    engine: require('catbox-redis'),
    host: _configuration2['default'].get('redis:host'),
    port: _configuration2['default'].get('redis:port'),
    partition: 'web-cache',
    password: _configuration2['default'].get('redis:password')
  }]
});

server.method('isAuthenticatedUser', isAuthenticatedUser, {
  cache: {
    cache: 'redisCache',
    expiresIn: 86400000,
    generateTimeout: 100
  },
  generateKey: function generateKey(token) {
    return token;
  }
});

function isAuthenticatedUser(token, resp, done) {
  console.info("isAuthenticatedUser :" + token);
  return done(null, resp);
}

server.connection({
  port: _configuration2['default'].get('hapi:port'),
  routes: {
    cors: {
      origin: ['*'],
      headers: ['Authorization', 'Content-Type', 'If-None-Match', 'appid', 'token']
    }
  },
  tls: {
    key: _fs2['default'].readFileSync('/opt/pulseServers/cert/domain.key', 'utf8'),
    cert: _fs2['default'].readFileSync('/opt/pulseServers/cert/domain.crt', 'utf8')
  }
});

server.register(require('hapi-auth-bearer-token'), function (err) {
  server.auth.strategy('bearer', 'bearer-access-token', _authAuthuser2['default']);
});

server.ext('onRequest', function (request, reply) {
  var userAgent = request.headers['user-agent'];
  if (request.url.path == '/') {
    reply['continue']();
  } else if (request.headers['x-forwarded-proto'] === 'http') {
    reply.redirect('https://' + request.headers.host + request.url.path).code(301);
    return reply['continue']();
  } else if (request.url.path.indexOf('/docs') < 0) {

    if (!request.headers['deviceid']) {
      reply(_boom2['default'].methodNotAllowed('deviceid header not present'));
    } else if (!request.headers['appversion']) {
      reply(_boom2['default'].methodNotAllowed('appVersion header not present'));
    } else if (!request.headers['user-agent']) {
      reply(_boom2['default'].methodNotAllowed('user-agent header not present'));
    } else if (!request.headers['accept-language']) {
      reply(_boom2['default'].methodNotAllowed('accept-language header not present'));
    } else {
      reply['continue']();
    }
  } else {
    reply['continue']();
  }
});

var routes = require('../routes/index');
server.route(routes);

var options = {
  opsInterval: 1000,
  reporters: [{
    reporter: require('good-console'),
    events: { log: '*', response: '*' }
  }, {
    reporter: require('good-file'),
    events: {
      response: '*',
      error: '*',
      log: '*'
    },
    config: {
      path: _configuration2['default'].get('hapi:logs'),
      rotate: 'daily',
      prefix: 'node-pulse-api'
    }
  }]
};

server.register({
  options: options,
  register: require('good')
}, function (err) {
  if (err) {
    console.error(err);
  }
});

// setup swagger options
var swaggerOptions = {
  apiVersion: _packageJson2['default'].version,
  basePath: _configuration2['default'].get('swagger:baseURL'),
  info: {
    title: 'GAB API documentation',
    description: 'GAB API consumed by Pulse Web & Mobile.'
  }
};

server.register([_inert2['default'], _vision2['default'], _blipp2['default'], {
  register: require('hapi-swagger'),
  options: swaggerOptions
}], function (err) {
  if (err) {
    console.error(err);
  }

  server.start(function () {
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
});

exports.server = server;