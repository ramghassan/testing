import logger from '../../logger';
import Apputil from '../../utils/apputil';
import SAModel from '../../models/schooladministration';

class SADelegate {
  constructor() {  
  }

  get = (ids, geoId) => {
    let query = {};
    if(ids && geoId){
      query = { geoId : geoId, _id : {$in: ids}};
    }else if(geoId){
      query = { geoId : geoId};
    }else{
      query = (ids) ? { _id : {$in: ids}} : '';
    }
    let saPromise = SAModel.find(query).exec()
    .then(function (sa) {
      logger.info('Response get SA delegate ', JSON.stringify(sa) );
      return sa;
    })
    .catch(function(err) {
      logger.error('Error get SA delegate', JSON.stringify(err));
      throw err;
    })
    return saPromise;
  }
	
  put = (body) => {
    let query = { name : body.name, geoId : body.geoId};
    let saInstance;
    let saPromise = SAModel.findOne(query).exec()
    .then(function (sa) {
      if(sa === null) {
        saInstance = new SAModel(body);
        logger.info('Response put SA delegate ', JSON.stringify(saInstance));
        return saInstance.save();
      }else{
        let err = {message:'Schoolsadministration name already created with same geoId'};
        throw err; 
      }
    })
    .catch(function(err) {
      logger.error('Error put sa delegate', JSON.stringify(err));
      throw err;
    })
    return saPromise;
  }
}

export default SADelegate;