var utils = require('../utils/util.js');

/***
 * @class
 * 表示请求过程中发生的异常
 */
var RequestError = (function () {
  function RequestError(message) {
    Error.call(this, message);
    this.message = message;
  }

  RequestError.prototype = new Error();
  RequestError.prototype.constructor = RequestError;

  return RequestError;
})();

/***
 * @function
 * request及异常处理
 */
var request = function (options, callback) {
  // 判断请求信息正常
  if (typeof options !== 'object') {
    var message = '请求传参应为object类型，但实际传了 '+(typeof options)+' 类型';
    throw new RequestError(message);
  }
  // 填充callback
  if (typeof callback !== 'object'){
    callback = {}
  }
  var successCb = callback.success;
  var failedCb = callback.failed;
  var completeCb = callback.complete;

  // 执行请求
  wx.request(utils.extend({}, options, {
    success: function(response){
      // console.log(response);
      var data = response.data;
      // 判断api请求结果是否正常
      if (data.status){
        successCb && successCb(data);
      } else {
        var error = new RequestError(data.err);
        failedCb && failedCb(error);
      }
    },
    fail: function(error){
      failedCb && failedCb(error);
    },
    complete: function(){
      completeCb && completeCb();
    }
  }));
}


module.exports = {
  request: request
};