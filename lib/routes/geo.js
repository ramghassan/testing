import GeoHandler from '../handlers/geo';

let geohandler = new GeoHandler();
let routes = [
  {method : 'PUT', path : '/geo', config : geohandler.put()},
  {method : 'GET', path : '/geo', config : geohandler.get()},
];

export { routes };