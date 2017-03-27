import SchoolHandler from '../handlers/school';

let schoolHandler = new SchoolHandler();
let routes = [
  {method : 'PUT', path : '/school', config : schoolHandler.put()},
  {method : 'PUT', path : '/school/enrolluser', config : schoolHandler.enrollUser()},
  {method : 'GET', path : '/school', config : schoolHandler.getSchools()}
];

export { routes };