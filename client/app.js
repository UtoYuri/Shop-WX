//app.js
var mta = require('./vendor/utils/mta_analysis.js');
var common = require('./vendor/functions/common.js');

App({
  onLaunch: function () {
    var $that = this;
    // 登录
    wx.login({
      success: res => {
        console.log("微信登录", res);
        var code = res.code;
        var encryptedData;
        var iv;

        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  console.log("获取用户信息", res);
                  common.setStorage('userInfo', res.userInfo, false);
                  encryptedData = res.encryptedData;
                  iv = res.iv;
                  // 将 res 发送给后台解码出 unionId 以完成登录
                  common.getUniqueID(code, encryptedData, iv, function(data){
                    console.log("服务器登录", data);
                    var uniqueID = {
                      openid: data.openid,
                      unionid: data.unionid,
                    };
                    common.setStorage('uniqueID', uniqueID, false);
                  });

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if ($that.userInfoReadyCallback) {
                    $that.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }
        });
      }
    });
    // 腾讯分析
    mta.App.init({
      "appID": "your appid",
      "eventID": "your eventid",
      "statPullDownFresh": true,
      "statShareApp": true,
      "statReachBottom": true
    });
  },
  globalData: {
    destination: null
  }
})