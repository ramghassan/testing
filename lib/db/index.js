let mongoose = require('mongoose');
let config = require('../configuration');

// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

mongoose.connect(config.get('mongo:url'), config.get('mongo:options'));
//all mongoose schemas need to be loaded before routes




