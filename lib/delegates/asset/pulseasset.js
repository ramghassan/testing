import logger from '../../logger';
import AssetsModel from '../../models/assets';

class AssetsDelegate {
  constructor() {
  }

  get = (assetIds) => {
    let query = (assetIds) ? { _id : {$in: assetIds}} : '';
    let assetsPromise = AssetsModel.find(query).exec()
    .then(function (asset) {
      if(asset){
        logger.info('Response get asset delegate ', JSON.stringify(asset));
        return asset;
      }else{
        let err = {message:'Invalid assetsId'};
        throw err; 
      }
    })
    .catch(function(err) {
      logger.error('Error get asset delegate', JSON.stringify(err));
      throw err;
    })
    return assetsPromise;
  }

  put = (body) => {
    let query = { "lookUp.originId" : body.lookUp.originId};
    console.log("body"+  JSON.stringify(body));
    let assetsInstance;
    let assetsPromise = AssetsModel.findOne(query).exec()
    .then(function (assets) {
      if(assets === null) {
        assetsInstance = new AssetsModel(body);
        logger.info('Response put assets section delegate ', JSON.stringify(assetsInstance));
        return assetsInstance.save();
      }else{
        let err = {message:'Assets with same originId already exists'};
        throw err; 
      }
    })
    .catch(function(err) {
      logger.error('Error put assets section delegate', JSON.stringify(err));
      throw err;
    })
    return assetsPromise;
  }

  assetSchool = (body) => {
    let query = {schoolId : body.schoolId, assetId : body.assetId};
    console.log("body"+  JSON.stringify(body));
    let assetsSchoolInstance;
    let assetsPromise = AssetsModel.findOne(query).exec()
    .then(function (assets) {
      if(assets === null) {
        assetsSchoolInstance = new AssetsModel(body);
        logger.info('Response put asset School delegate ', JSON.stringify(assetsSchoolInstance));
        return assetsSchoolInstance.save();
      }else{
        let err = {message:'Provision of assets with same school already Exists'};
        throw err; 
      }
    })
    .catch(function(err) {
      logger.error('Error put asset School delegate', JSON.stringify(err));
      throw err;
    })
    return assetsPromise;
  }

  isValidAssetId = (assetId) => {
    let query = { "_id" : assetId}
    let assetsPromise = AssetsModel.findOne(query).exec()
    .then((asset) => {
      if(asset){
        logger.info('Response get asset delegate ', JSON.stringify(asset));
        return asset;
      }else{
        let err = {message:'Invalid assetsId'};
        throw err; 
      }
    })
    .catch((err) => {
      logger.error('Error get asset delegate', JSON.stringify(err));
      throw err;
    })
    return assetsPromise;
  }
}

export default AssetsDelegate;