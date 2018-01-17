//user.js
//获取应用实例
const app = getApp();
var common = require('../../vendor/functions/common.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    optionGroups:[
      [
        {
          'page': '/pages/address/address',
          'title': '收货地址',
          'icon': '/source/send.png'
        },
        {
          'page': '/pages/order/list',
          'title': '我的订单',
          'icon': '/source/bag.png'
        }
      ],
      [
        {
          'page': '/pages/about/contact',
          'title': '更多规格',
          'icon': '/source/page.png'
        },
      ],
      [
        {
          'page': '/pages/about/feedback',
          'title': '反馈留言',
          'icon': '/source/chat.png'
        },
        {
          'page': '/pages/about/about',
          'title': '关于',
          'icon': '/source/tag.png'
        },
      ]
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  getUserInfo: function (e) {
    var $that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        var code = res.code;
        var encryptedData;
        var iv;
        wx.getUserInfo({
          success: res => {
            // console.log(res);
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo;
            encryptedData = res.encryptedData;
            iv = res.iv;
            $that.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });
            common.getUniqueID(code, encryptedData, iv, function (data) {
              // console.log(data);
              var uniqueID = {
                openid: data.openid,
                unionid: data.unionid,
              };
              common.setStorage('uniqueID', uniqueID, false);
            });

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (app.userInfoReadyCallback) {
              app.userInfoReadyCallback(res)
            }
          }
        });
      }
    });
  }
})
