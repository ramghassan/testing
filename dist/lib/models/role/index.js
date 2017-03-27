'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _configuration = require('../../configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var Schema = _mongoose2['default'].Schema;

var roleSchema = new Schema({
  name: { type: String, required: true, trim: true }
});

var role = _mongoose2['default'].model('role', roleSchema, 'role');
module.exports = _mongoose2['default'];