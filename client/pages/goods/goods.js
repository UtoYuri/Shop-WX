// pages/goods/goods.js
var mta = require('../../vendor/utils/mta_analysis.js');
var common = require('../../vendor/functions/common.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods_id: 0,
    banners: [],
    goods_meta: null,
    total_cart_num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cart = common.getStorage('cart', true) || [];
    var total_cart_num = 0;
    for (var i = 0; i < cart.length; ++i) {
      total_cart_num += cart[i].num;
    }
    this.setData({
      goods_id: parseInt(options.goods_id),
      total_cart_num: total_cart_num
    });
    this.getGoods(options.goods_id);
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
    // 刷新商品信息
    this.getGoods(this.data.goods_id);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 用户点击跳转到购物车
   */
  navgateToCart: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },

  /**
   * 用户点击加入购物车
   */
  addInCart: function () {
    var goods_id = this.data.goods_id;
    var cart = common.getStorage('cart', true) || [];
    var isIn = false;
    // 已经存在购物车则数量+1
    for (var i = 0; i < cart.length; ++i) {
      var goods = cart[i];
      if (goods.id == goods_id){
        goods.num ++;
        isIn = true;
        break;
      }
    }
    // 不存在购物车则加入
    if (!isIn){
      cart.push({
        id: goods_id,
        num: 1
      });
    }
    this.setData({
      total_cart_num: this.data.total_cart_num + 1
    });
    common.setStorage('cart', cart, true);
    wx.showToast({
      title: '添加成功',
    });
  },

  /**
   * 获取商品详情
   */
  getGoods: function(goods_id){
    var $that = this;
    var banners = [];
    // 获取商品信息
    var uniqueID = common.getStorage('uniqueID', true);
    common.getGoods(uniqueID.openid || '', goods_id, function (data) {
      // 获取商品信息成功
      console.log("商品信息", data);
      var goods = data.goods[0] || {};
      goods.sold_count = '0';  // 自慰销售量
      goods.cover && banners.push(goods.cover);
      $that.setData({
        goods_meta: goods,
        banners: banners,
      });
      wx.stopPullDownRefresh();
    }, function (error) {
      // 获取商品信息失败
      console.log("商品信息", error);
      wx.stopPullDownRefresh();
    });

    // 获取商品展示图
    common.getGoodsBanner(goods_id, function (data) {
      // 获取商品展示图成功
      console.log("商品展示图", data);
      for (var i = 0; i < data.goods_banner.length; ++i) {
        var banner = data.goods_banner[i];
        banners.push(banner.banner);
      }
      $that.setData({
        banners: banners,
      });
      wx.stopPullDownRefresh();
    }, function (error) {
      // 获取商品展示图失败
      console.log("商品展示图", error);
      wx.stopPullDownRefresh();
    });
  }
})