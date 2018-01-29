// pages/order/list.js
var mta = require('../../vendor/utils/mta_analysis.js');
var common = require('../../vendor/functions/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopName: '',
    openid: null,
    page: 1,
    limit: 10,
    isLoading: false,

    orders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.icon && options.toast){
      wx.showToast({
        title: options.toast,
        icon: options.icon
      });
    }
    var shop_meta = common.getStorage('shop_meta', true);
    this.setData({
      shopName: shop_meta.name || this.data.shopName
    });
    // 未登录情形
    var uniqueID = common.getStorage('uniqueID', true);
    if (!uniqueID) {
      wx.switchTab({
        url: '/pages/user/user',
      });
      return;
    }
    this.setData({
      openid: uniqueID.openid 
    });
    this.getOrderList(true);
    // 腾讯分析
    mta.Page.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getOrderList(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getOrderList(false);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 用户点击查看物流
   */
  showDeliverRoute: function (e) {
    var deliveryCompany = e.currentTarget.dataset.deliverycompany;
    var deliveryNumber = e.currentTarget.dataset.deliverynumber;
    wx.navigateTo({
      url: '/pages/order/deliver?number=' + deliveryNumber + '&company=' + deliveryCompany,
    })
  },

  /**
   * 用户点击支付
   */
  pay: function (e) {
    var $that = this;
    var order_id = e.currentTarget.dataset.orderid;
    var total_price = e.currentTarget.dataset.totalprice;
    var order_stamp = e.currentTarget.dataset.orderstamp;
    var goods_count = e.currentTarget.dataset.goodscount;
    var uniqueID = common.getStorage('uniqueID', true);
    
    // 预订单
    common.preOrder(order_id, uniqueID.openid, total_price * 100, '' + goods_count + ' 件桃姐礼盒商品', order_stamp, function (data) {
      console.log('微信预订单', data);
      // 调用微信支付接口
      wx.requestPayment({
        timeStamp: '' + data.timeStamp,
        nonceStr: data.nonceStr,
        package: 'prepay_id=' + data.prepayId,
        signType: 'MD5',
        paySign: data.sign,
        'success': function (res) {
          console.log('微信支付', res);
          $that.getOrderList(true);
        },
        'fail': function (res) {
          console.log('微信支付', res);
          wx.showToast({
            title: '支付失败',
            icon: 'loading'
          });
        }
      });
    }, function (error) {
      console.log('微信预订单', error);
      wx.showToast({
        title: error,
        icon: 'loading'
      });
    });
  },

  /**
   * 获取订单列表
   */
  getOrderList: function (isInit) {
    var $that = this;
    var limit = $that.data.limit;
    if (isInit) {
      var page = 1;
      var orders = [];
    } else {
      var isLoading = $that.data.isLoading;
      var page = $that.data.page;
      var orders = $that.data.orders;
      // 正在加载，忽略此次请求
      if (isLoading) {
        wx.stopPullDownRefresh();
        return;
      }
    }
    // 加载中标志
    $that.setData({
      isLoading: true
    });
    // 未登录情形
    var uniqueID = common.getStorage('uniqueID', true);
    // 开始加载 
    common.getOrderList($that.data.openid, page, limit, function (data) {
      console.log("我的订单", data);
      // 加载成功
      $that.setData({
        isLoading: false,
        page: page + 1,
        orders: common.utils.extend(orders, data.orders)
      });
      wx.stopPullDownRefresh();
    }, function (error) {
      // 加载失败
      console.log("我的订单", error);
      $that.setData({
        isLoading: false
      });
      wx.showToast({
        title: '加载订单列表失败，请重试。',
        icon: 'loading'
      });
      wx.stopPullDownRefresh();
    });
  }
})