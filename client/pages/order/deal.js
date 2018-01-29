// pages/order/deal.js
const app = getApp();
var mta = require('../../vendor/utils/mta_analysis.js');
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
    total_freight: 0,
    remark: ""
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
    var cart = common.getStorage('cart', true) || [];
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
   * 备注更改
   */
  remarkChanged: function (e) {
    this.setData({
      remark: e.detail.value
    });
  },

  /**
   * 付款
   */
  pay: function () {
    var $that = this;
    var cart = $that.data.cart;
    // 购物车空情形
    if (cart.length == 0) {
      wx.showToast({
        title: '订单空空的',
        icon: 'loading'
      });
      return;
    }
    // 未登录情形
    var uniqueID = common.getStorage('uniqueID', true);
    if (!uniqueID) {
      wx.switchTab({
        url: '/pages/user/user',
      });
      return;
    }
    // 检测收货地址
    if (!$that.data.destination) {
      wx.showToast({
        title: '请完善收货地址',
        icon: 'loading'
      });
      return;
    }
    // 创建订单 
    var goods_in_order = [];
    for (var i = 0; i < cart.length; ++i) {
      goods_in_order.push('' + cart[i].goods_id + ':' + cart[i].cart_num);
    }
    goods_in_order = goods_in_order.join(',')
    var order = {
      goods_in_order: goods_in_order,
      goods_count: $that.data.total_goods,
      price_sum: $that.data.total_price,
      freight_sum: $that.data.total_freight,
      remark: $that.data.remark
    };
    common.createOrder(uniqueID.openid, order, $that.data.destination, function (data) {
      console.log('创建订单', data);
      var total_price = parseFloat(order['price_sum']) + parseFloat(order['freight_sum']);
      // 预订单
      common.preOrder(data.order_id, uniqueID.openid, total_price*100, '' + order['goods_count'] + ' 件桃姐礼盒商品', data.order_stamp, function(data){
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
            // 成功则清空购物车并跳转到我的订单列表
            common.setStorage('cart', [], true);
            wx.redirectTo({
              url: '/pages/order/list?icon=success&toast=下单成功',
            });
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
    }, function(error){
      console.log('创建订单', error);
    });
  },

})