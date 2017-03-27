import logger from '../../logger';
import apputil from '../../utils/apputil';
import GeoModel from '../../models/geo';

class GeoDelegate {
  constructor() {
  }

  get = (geoids) => {
    let query = (geoids) ? { _id : {$in: geoids}} : '';
    let geoPromise = GeoModel.find(query).exec()
    .then(function (geo) {
      logger.info('Response get geo delegate ', JSON.stringify(geo));
      return geo;
    })
    .catch(function(err) {
      logger.error('Error get geo delegate', JSON.stringify(err));
      throw err;
    })
    return geoPromise;
  }

  put = (body) => {
    let query = { name : body.name};
    let geoInstance;
    let geoPromise = GeoModel.findOne(query).exec()
    .then(function (geo) {
      if(geo === null) {
        geoInstance = new GeoModel(body);
        logger.info('Response put geo delegate ', JSON.stringify(geoInstance));
        return geoInstance.save();
      }else{
        let err = {message:'Geo name already exists'};
        throw err; 
      }
    })
    .catch(function(err) {
      logger.error('Error put geo delegate', JSON.stringify(err));
      throw err;
    })
    return geoPromise;
  }
}

export default GeoDelegate;