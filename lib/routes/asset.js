import AssetHandler from '../handlers/asset';

let assetHandler = new AssetHandler();
let routes = [
  {method : 'PUT', path : '/asset', config : assetHandler.put()},
  {method : 'GET', path : '/asset', config : assetHandler.get()},
  {method : 'PUT', path : '/asset/school', config : assetHandler.assetSchool()},
  {method : 'GET', path : '/asset/school', config : assetHandler.getAssetSchool()},
  {method : 'GET', path : '/asset/authorized', config : assetHandler.assetAuthorized()}
];

export { routes };