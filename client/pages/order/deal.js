// pages/order/deal.js
const app = getApp()
var common = require('../../vendor/functions/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopName: '超市',
    destination: null,
    cart: [],
    total_price: 0,
    total_goods: 0,
    total_freight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $that = this;
    // 获取商店名称
    var shop_meta = common.getStorage('shop_meta', true);
    $that.setData({
      shopName: shop_meta.name || this.data.shopName
    });
    // 获取购物车内容
    var cart = common.getStorage('cart', true);
    var goods_ids = [];
    for (var i = 0; i < cart.length; ++i) {
      goods_ids.push(cart[i].id);
    }
    // 批量获取商品信息
    common.getGoodsListInCart(goods_ids.join(','), function (data) {
      console.log('购物车商品列表', data);
      var total_price = 0;
      var total_goods = 0;
      var total_freight = 0;
      // 添加商品数量
      for (var i = 0; i < data.goods_list.length; ++i) {
        var goods_id = data.goods_list[i].goods_id;
        for (var j = 0; j < cart.length; ++j) {
          if (cart[j].id == goods_id) {
            // 商品总数
            total_goods += cart[j].num;
            // 商品总价
            total_price += parseFloat(data.goods_list[i].price) * cart[j].num;
            // 商品总运费
            total_freight += parseFloat(data.goods_list[i].freight);
            common.utils.extend(data.goods_list[i], { cart_num: cart[j].num });
          }
        }
      }
      $that.setData({
        cart: data.goods_list,
        total_goods: total_goods,
        total_price: total_price,
        total_freight: total_freight,
      });
    }, function (error) {
      console.log('购物车商品列表', error);
    });
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
    // 刷新收货地址
    if (app.globalData.destination) {
      this.setData({
        destination: app.globalData.destination,
      });
    }
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
   * 选择地址
   */
  chooseLocation: function () {
    var $that = this;
    wx.navigateTo({
      url: '/pages/address/address?from=/pages/order/order&point=destination',
    });
  },

  /**
   * 付款
   */
  pay: function () {
    var $that = this;
    // 检测收货地址
    if (!$that.data.destination) {
      wx.showToast({
        title: '请完善收货地址',
        icon: 'loading'
      });
      return;
    }
    wx.showToast({
      title: '爷爷舍不得',
      icon: 'loading'
    });
  },


  
})