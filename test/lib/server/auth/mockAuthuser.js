export default {
  tokenType: 'Bearer',
  validateFunc: function (token, callback) {
      callback(null, true, {token: token});
  }
};
