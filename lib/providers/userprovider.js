import Config from '../configuration';
import Boom from 'boom';
import Http from 'http-as-promised';
import logger from '../logger';
import ForgeRockService from '../thirdparty/forgerock';

class UserProvider {
  constructor() {
    this.forgeRockService = new ForgeRockService();
  }

  isValidtoken = (token) => {
     return this.forgeRockService.isTokenValid(token);
  }
}
export default UserProvider;