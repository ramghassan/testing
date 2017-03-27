'use strict';

var mongoose = require('mongoose');
var config = require('../configuration');

// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

mongoose.connect(config.get('mongo:url'), config.get('mongo:options'));
//all mongoose schemas need to be loaded before routes