import SwaggerHandler from '../handlers/swagger';

let swaggerHandler = new SwaggerHandler();
module.exports.routes = [
  {method: 'GET', path: '/', config:swaggerHandler.index()},
];
