import Config from '../configuration';
import AuthUser from './auth/mockAuthuser';
import Hapi from 'hapi';
import db from '../db';

let server = new Hapi.Server({
cache: [
    {
      name: 'redisCache',
      engine: require('catbox-redis'),
      host: Config.get('redis:host'),
      port: Config.get('redis:port'),
      partition: 'web-cache'
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
  console.info("isAuthenticatedUser from TestServer:"+ token);
  return done(null, resp);
}


server.connection({
  port: Config.get('hapi:port'),
  routes: {
    cors: {
      origin : ['*'],
      headers : ['Authorization', 'Content-Type', 'If-None-Match', 'appid', 'token']
    }
  }
});

server.register(require('hapi-auth-bearer-token'), function (err) {
    server.auth.strategy('bearer', 'bearer-access-token', AuthUser);
});

let routes = require('../routes/index');
server.route(routes);

server.start(function(){
      console.log('Server running at:', server.info.uri);
  });

export { server };
