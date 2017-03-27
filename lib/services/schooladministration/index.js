import Config from '../../configuration';
import Boom from 'boom';
import Http from 'http-as-promised';
import logger from '../../logger';
import SchoolAdminDelegate from '../../delegates/schooladministration/pulseschooladmin';
import GeoDelegate from '../../delegates/geo/pulsegeo';
import ServiceResponse from '../ServiceResponse';
import _ from 'lodash';

class SchoolAdminService {
  constructor() {
    this.schoolAdminDelegate = new SchoolAdminDelegate();
    this.geoDelegate = new GeoDelegate();
  }

  get = (id, geoId) => {    
    let saPromise =  this.schoolAdminDelegate.get(id, geoId)
    .then((saRes)=>{       
     _.each(saRes,(sa) =>{       
        let links = sa.links.toObject();
        let linksKeys = Object.keys(links); 
      if(linksKeys.length < 1) { delete sa.links; }
      else {
        for(let index in linksKeys) {         
         if(!links[linksKeys[index]]) {         
         delete links[linksKeys[index]];  
         }
       }
      }
    })      
      return saRes;
    })
    .catch((err)=>{
      logger.info('error get schooladministration Service');
          throw err;
    })    
    return saPromise;
  }

  put = (body) => {
    let serviceErr = {};
    let schoolAdminPromise = this.geoDelegate.get(body.geoId)
    .then((geo) => {
      logger.info('response put schooladministration Service', JSON.stringify(geo));
      if(!geo || geo.length == 0) {
        console.log('===========response put schooladministration Service', JSON.stringify(geo));
        serviceErr.message='Invalid geoid';
        throw new ServiceResponse(serviceErr,'',null);
      }              
      else {
        return this.schoolAdminDelegate.put(body)
      }
    })
    .catch(function(err){
      logger.info('error in creating schooladministration Service' + JSON.stringify(err));
      if(typeof err.message !== 'undefined') { 
       serviceErr.message = err.message;
       throw new ServiceResponse(serviceErr,'',null);
      }
      throw err;
    })
    return schoolAdminPromise;
  }
}

export default SchoolAdminService;