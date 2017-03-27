import SchoolAdminHandler from '../handlers/schooladministration';

let schoolAdminHandler = new SchoolAdminHandler();
let routes = [
  {method : 'PUT', path : '/schoolsadministration', config : schoolAdminHandler.put()},
  {method : 'GET', path : '/schoolsadministration', config : schoolAdminHandler.get()},
];

export { routes };