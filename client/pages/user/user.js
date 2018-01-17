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

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    // 展示用户信息
    var userInfo = common.getStorage('userInfo', true);
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // 保证用户已登录
    var uniqueID = common.getStorage('uniqueID', true);
    if (!uniqueID) {
      this.getUserInfo();
    }
  },

  /**
   * 点击头像
   */
  bindViewTap: function() {
    
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (e) {
    var $that = this;
    // 登录
    wx.login({
      success: res => {
        console.log("微信登录", res);
        var code = res.code;
        var encryptedData;
        var iv;
        // 获取用户信息
        wx.getUserInfo({
          success: res => {
            console.log("获取用户信息", res);
            // 可以将 res 发送给后台解码出 unionId
            common.setStorage('userInfo', res.userInfo, false);
            encryptedData = res.encryptedData;
            iv = res.iv;
            $that.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });
            common.getUniqueID(code, encryptedData, iv, function (data) {
              console.log("服务器登录", data);
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
          },
          fail: res => {
            // 用户主动点击时询问是否更改授权
            if (e) {
              wx.showModal({
                title: '权限管理',
                content: '您已拒绝授权，是否前往开启。',
                success: res => {
                  if (res.confirm) {
                    wx.openSetting();
                  }
                }
              });
            }
          }
        });
      }
    });
  }
})
