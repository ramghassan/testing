import logger from '../../logger';
import AssetsModel from '../../models/assets';
import SchoolAssetModel from '../../models/schoolasset';

class AssetsSchoolDelegate {
  constructor() {
  }

  get = (assetIds,schoolIds) => {
    schoolIds = schoolIds && !(schoolIds instanceof Array) ?  [schoolIds] : schoolIds;
    assetIds = assetIds && !(assetIds instanceof Array) ? [assetIds] : assetIds;
    let query = {};
    if(assetIds && schoolIds){
      query = {assetId : {$in: assetIds}, schoolId : {$in: schoolIds}}
    }else if(assetIds){
      query = {assetId : {$in: assetIds}}
    }else if(schoolIds){
      query = {schoolId : {$in: schoolIds}}
    }
    let assetsPromise = SchoolAssetModel.find(query).exec()
    .then(function (asset) {
      if(asset){
        logger.info('Response get schoolasset delegate ', JSON.stringify(asset));
        return asset;
      }else{
        let err = {message:'This asset is not enrolled with this school'};
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
    let query = {schoolId : body.schoolId, assetId : body.assetId};
    let assetsInstance;
    let assetsPromise = SchoolAssetModel.findOne(query).exec()
    .then(function (assets) {
      if(assets === null) {
        assetsInstance = new SchoolAssetModel(body);
        logger.info('Response put asset School delegate ', JSON.stringify(assetsInstance));
        return assetsInstance.save();
      }else{
        let err = {message:'Provision of assets with same school already exists'};
        throw err; 
      }
    })
    .catch(function(err) {
      logger.error('Error put asset School delegate', JSON.stringify(err));
      throw err;
    })
    return assetsPromise;
  }

  getSchoolAssets(assetId, schoolIds){
    return SchoolAssetModel.findOne({assetId : assetId, schoolId : {$in : schoolIds}});
  }
}

export default AssetsSchoolDelegate;