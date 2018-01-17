var utils = require('../utils/util.js');

/***
 * @class
 * 表示存储过程中发生的异常
 */
var StoreError = (function () {
  function StoreError(message) {
    Error.call(this, message);
    this.message = message;
  }

  StoreError.prototype = new Error();
  StoreError.prototype.constructor = StoreError;

  return StoreError;
})();

/***
 * @setStorage
 * setStorage及异常处理
 */
var setStorage = function (key, value, isSync, callback) {
  // 判断key类型
  if (typeof key !== 'string') {
    var message = 'key参数应该是string类型，但实际传了 ' + (typeof key) + ' 类型';
    throw new StoreError(message);
  }
  // 判断isSync类型
  if (typeof isSync !== 'boolean') {
    var message = 'isSync参数应该是boolean类型，但实际传了 ' + (typeof isSync) + ' 类型';
    throw new StoreError(message);
  }
  // 默认同步存储
  if (typeof isSync !== 'undefined') {
    isSync = true;
  }
  if (typeof callback !== 'object') {
    callback = {}
  }
  var successCb = callback.success;
  var failedCb = callback.failed;
  var completeCb = callback.complete;

  // 存储开始
  try {
    if (isSync) {
      wx.setStorageSync(key, value);
    }else{
      wx.setStorage(key, value);
    }
    successCb && successCb();
  } catch (e) {
    failedCb && failedCb(e);
    throw new StoreError('set local storage failed');
  }
  completeCb && completeCb();
}


/***
 * @getStorage
 * getStorage及异常处理
 */
var getStorage = function (key, isSync, callback) {
  // 判断key类型
  if (typeof key !== 'string') {
    var message = 'key参数应该是string类型，但实际传了 ' + (typeof key) + ' 类型';
    throw new StoreError(message);
  }
  // 判断isSync类型
  if (typeof isSync !== 'boolean') {
    var message = 'isSync参数应该是boolean类型，但实际传了 ' + (typeof isSync) + ' 类型';
    throw new StoreError(message);
  }
  // 默认同步存储
  if (typeof isSync !== 'undefined') {
    isSync = true;
  }
  if (typeof callback !== 'object') {
    callback = {}
  }
  var successCb = callback.success;
  var failedCb = callback.failed;
  var completeCb = callback.complete;

  // 读取开始
  var value;
  try {
    if (isSync) {
      value = wx.getStorageSync(key);
    } else {
      value = wx.getStorage(key);
    }
    successCb && successCb(value);
  } catch (e) {
    failedCb && failedCb(e);
    throw new StoreError('get local storage failed');
  }
  completeCb && completeCb();
  return value;
}


module.exports = {
  setStorage: setStorage,
  getStorage: getStorage
};