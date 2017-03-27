import UserHandler from '../handlers/user';

let userHandler = new UserHandler();
let routes = [

   {method: 'PUT', path: '/user' , config:userHandler.put()},
   {method: 'POST', path: '/user/authenticate', config: userHandler.login()},
   {method: 'GET', path: '/user' , config:userHandler.getUserProfile()},  
   {method: 'GET', path: '/user/schools', config:userHandler.getSchools()},
   {method: 'GET', path: '/user/logout' , config:userHandler.logout()},
   {method: 'GET', path: '/user/isTokenValid' , config:userHandler.isTokenValid()}
];

export { routes };