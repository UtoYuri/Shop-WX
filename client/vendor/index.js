var request = require('./libs/request');
var storage = require('./libs/storage.js');
var utils = require('./utils/util.js');

var exports = module.exports = {
  request: request.request,
  setStorage: storage.setStorage,
  getStorage: storage.getStorage,
  utils: utils
};