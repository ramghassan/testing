import Config from '../../configuration';
import Boom from 'boom';
import Http from 'http-as-promised';
import logger from '../../logger';
import GeoDelegate from '../../delegates/geo/pulsegeo';
import ServiceResponse from '../ServiceResponse';
import _ from 'lodash';

class GeoService {
  constructor() {
    this.geoDelegate = new GeoDelegate();
  }

  get = (id) => {    
   let geoPromise =  this.geoDelegate.get(id)
    .then((geoRes)=>{       
     _.each(geoRes,(geo) =>{       
        let links = geo.links.toObject();
        let linksKeys = Object.keys(links); 
      if(linksKeys.length < 1) { delete geo.links; }
      else {
        for(let index in linksKeys) {         
         if(!links[linksKeys[index]]) {         
         delete links[linksKeys[index]];  
         }
       }
      }
    })      
      return geoRes;
    })
    .catch((err)=>{
      logger.info('error get schooladministration Service');
          throw err;
    })    
    return geoPromise;
  }

  put = (payload) => {
    let serviceErr = {};
    let geoCreationPromise = this.geoDelegate.put(payload)
    .then((response) => {
      logger.info('response put Geo Service', JSON.stringify(response));
      return response;
    })
    .catch(function(err){
      logger.info('error in creating Geo Service', JSON.stringify(err));
      if(typeof err.message !== 'undefined') { 
       serviceErr.message = err.message;
       throw new ServiceResponse(serviceErr,'',null);
      }
      throw err;
    })
    return geoCreationPromise;
  }
}

export default GeoService;