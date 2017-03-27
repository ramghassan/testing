import fs from 'fs';
import path from 'path';
import logger from '../logger';

class DBUtil {
  getPopulateQuery( query ) {
    logger.info('start get', {filename: __filename, pid: process.pid});
    let populateQuery = [];
     if(query) {
      let models;
      if(query.include.indexOf(',')) {
        models = query.include.split(',');        
      } else {
        models = [];
        models[0] = query.include.trim();
      }      
      for(let index in models) {
        let options = { path : models[index].trim()};
        populateQuery.push(options);
      }      
    }
    return populateQuery;
  }
}

let dbutil = new DBUtil();
export default dbutil;