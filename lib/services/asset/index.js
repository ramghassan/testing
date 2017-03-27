import Config from '../../configuration';
import Boom from 'boom';
import Http from 'http-as-promised';
import logger from '../../logger';
import AssetsDelegate from '../../delegates/asset/pulseasset'
import AssetsSchoolDelegate from '../../delegates/schoolasset/pulseschoolasset'
import SchoolDelegate from '../../delegates/school/pulseschool'
import SchoolUserDelegate from '../../delegates/schooluser'
import ServiceResponse from '../ServiceResponse';
import UserDelegate from '../../delegates/user'
import UserProvider from '../../providers/userprovider'
import AppUtil from '../../utils/apputil';
import _ from 'lodash';

class AssetsService {
  constructor() {
    this.assetsDelegate = new AssetsDelegate();
    this.assetsSchoolDelegate = new AssetsSchoolDelegate();
    this.schoolDelegate = new SchoolDelegate();
    this.schoolUserDelegate = new SchoolUserDelegate();
    this.userDelegate = new UserDelegate();
    this.userProvider = new UserProvider();
    this.serviceErr = {};
  }

  get = (ids) => { 
    return this.assetsDelegate.get(ids);
  }

  getAssetSchool = (ids, schoolIds) => { 
    return this.assetsSchoolDelegate.get(ids, schoolIds);
  }

  put = (payload) => {
    let assetsPromise = this.assetsDelegate.put(payload)
    .then((response) => {
      logger.info('response put asset Service', JSON.stringify(response));
      return response;
    })
    .catch((err) => {
      logger.info('error in creating asset Service', JSON.stringify(err));
      if(typeof err.message !== 'undefined') { 
       this.serviceErr.message = err.message;
       throw new ServiceResponse(this.serviceErr,'',null);
      }
      throw err;
    })
    return assetsPromise;
  }
  
  assetSchool = (payload) => {
    let assetsPromise = this.schoolDelegate.isValidSchoolID(payload.schoolId)
    .then((school) => {
      if(!school) {
        this.serviceErr.message='Invalid schoolId';
        throw new ServiceResponse(this.serviceErr,'',null);
      }              
      else {
        logger.info('response get assetSchool Service validate school', JSON.stringify(school));
        return this.assetsDelegate.isValidAssetId(payload.assetId)
        
      }
    })
    .then((asset) => {
      logger.info( JSON.stringify(payload), 'response get assetSchool Service validate asset', JSON.stringify(asset));
      if(!asset) {
        this.serviceErr.message='Invalid assetId';
        throw new ServiceResponse(this.serviceErr,'',null);
      }              
      else {
        logger.info('response get assetSchool Service validate asset', JSON.stringify(asset));
        return this.assetsSchoolDelegate.put(payload);
      }
    })
    .catch((err) => {
      logger.info('error in creating assetSchool Service', JSON.stringify(err));
      if(typeof err.message !== 'undefined') { 
       this.serviceErr.message = err.message;
       throw new ServiceResponse(this.serviceErr,'',null);
      }
      throw err;
    })
    return assetsPromise;
  }

  assetAuthorized = (payload) => {
    let assetId;
    let schoolIds = [];
    let pearsonAdmin;
    let assetsPromise = this.userProvider.isValidtoken(payload.token)
    .then((token) => {
      if(token.valid){
        logger.info("Is token valid true....", token);
        if(AppUtil.isPearsonAdmin(payload.roleValue)){
          pearsonAdmin = true;
          return true; 
        }
        return this.userDelegate.getUser(payload.userId)
      }else{
        logger.info("Is token valid false....", token);
        this.serviceErr.message='Token not valid';
        throw new ServiceResponse(this.serviceErr,'',null);
      }
    })
    .then((user) => {
      if(user){
        return this.assetsDelegate.isValidAssetId(payload.assetId)
      }else{
        this.serviceErr.message='User in not valid user';
        throw new ServiceResponse(this.serviceErr,'',null);
      }
    })
    .then((asset) => {
      if(pearsonAdmin){
        return true;
      }
      if(asset){
        return this.schoolUserDelegate.getSchoolsByUserID(payload.userId);
      }else{
        this.serviceErr.message='AssetId is invalid';
        throw new ServiceResponse(this.serviceErr,'',null);
      }
    })
    .then((school) => {
      if(pearsonAdmin){
        return true;
      }
      if(school.length == 0) {
        this.serviceErr.message='This user is not enrolled in any schools';
        throw new ServiceResponse(this.serviceErr,'',null);
      }              
      else {
        _.each(school, (arg) => { 
          schoolIds.push(arg.schoolId);
        })
        logger.info(schoolIds, ' response get assetSchool Service validate school ', JSON.stringify(school));
        return this.assetsSchoolDelegate.getSchoolAssets(payload.assetId,schoolIds)
      }
    })
    .then((schoolasset) => {
      if(pearsonAdmin){
        return true;
      }
      logger.info(' response Service validate asset school ', JSON.stringify(schoolasset));
      if(!schoolasset) {
        this.serviceErr.message='The school, the user enrolled dont have the assetId';
        throw new ServiceResponse(this.serviceErr,'',null);
      }              
      else {
        logger.info(' response Service validate asset school ', JSON.stringify(schoolasset));
        return schoolasset;
      }
    })
    .catch((err) => {
      logger.info('error in user authorization on asset Service', JSON.stringify(err));
      if(typeof err.message !== 'undefined') { 
       this.serviceErr.message = err.message;
       throw new ServiceResponse(this.serviceErr,'',null);
      }
      throw err;
    })
    return assetsPromise;
  }
}

export default AssetsService;