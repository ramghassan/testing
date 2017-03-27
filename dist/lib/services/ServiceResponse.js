"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceResponse = function ServiceResponse(err, errMessage, resp) {
    _classCallCheck(this, ServiceResponse);

    this.err = err, this.data = resp, this.errMessage = errMessage;
};

exports["default"] = ServiceResponse;
module.exports = exports["default"];