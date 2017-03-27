import winston from 'winston';
import config from '../configuration';

class Logger {
  constructor() {
    this.transports = [];
    if(config.getEnv() === 'development' || config.getEnv() === 'local' || config.getEnv() === 'test') {
      this.transports.push(new (winston.transports.Console)());
    } else {
      this.transports.push(new winston.transports.File({
        filename: config.get('logger:filename'),
        maxsize: 1048576,
        maxFiles: 3,
        level: config.get('logger:level'),
        logstash: true
      }));
    }
  }
}

export default new (winston.Logger)({
    transports: new Logger().transports
});
