// pages/cart/cart.js
var common = require('../../vendor/functions/common.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopName: '超市',
    cart: [],
    total_price: 0,
    total_goods: 0,
    total_freight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取商店名称
    var shop_meta = common.getStorage('shop_meta', true);
    this.setData({
      shopName: shop_meta.name || this.data.shopName
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
    var $that = this;
    var cart = common.getStorage('cart', true);
    var goods_ids = [];
    for (var i = 0; i < cart.length; ++i){
      goods_ids.push(cart[i].id);
    }
    // 批量获取商品信息
    common.getGoodsListInCart(goods_ids.join(','), function(data){
      console.log('购物车商品列表', data);
      var total_price = 0;
      var total_goods = 0;
      var total_freight = 0;
      // 添加商品数量
      for (var i = 0; i < data.goods_list.length; ++i){
        var goods_id = data.goods_list[i].goods_id;
        for (var j = 0; j < cart.length; ++j) {
          if (cart[j].id == goods_id) {
            // 商品总数
            total_goods += cart[j].num;
            // 商品总价
            total_price += parseFloat(data.goods_list[i].price) * cart[j].num;
            // 商品总运费
            total_freight += parseFloat(data.goods_list[i].freight);
            common.utils.extend(data.goods_list[i], { cart_num: cart[j].num});
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
   * 用户点击打开商品详情
   */
  showGoods: function (e) {
    var goods_id = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '/pages/goods/goods?goods_id=' + goods_id
    });
  },

  /**
   * 购物车商品数量减一
   */
  reduceGoodsNum: function (e) {
    var $that = this;
    var goods_id = e.currentTarget.dataset.goodsid;
    var goods = $that.data.cart;
    var cart = common.getStorage('cart', true);

    var price = 0;
    var freight = 0;
    // 刷新本页面购物车信息
    for (var i = 0; i < goods.length; ++i) {
      if (goods[i].goods_id == goods_id) {
        goods[i].cart_num--;
        price = parseFloat(goods[i].price);
        // 商品移除
        if (goods[i].cart_num <= 0) {
          freight = parseFloat(goods[i].freight);
          goods.splice(i, 1);
        }
        break;
      }
    }
    // 刷新存储的购物车信息
    for (var i = 0; i < cart.length; ++i) {
      if (cart[i].id == goods_id) {
        cart[i].num--;
        // 商品移除
        if (cart[i].num <= 0) {
          cart.splice(i, 1);
        }
        break;
      }
    }
    $that.setData({
      cart: goods,
      total_price: $that.data.total_price - price,
      total_goods: $that.data.total_goods - 1,
      total_freight: $that.data.total_freight - freight,
    });
    common.setStorage('cart', cart, true);
  },

  /**
   * 购物车商品数量加一
   */
  addGoodsNum: function (e) {
    var $that = this;
    var goods_id = e.currentTarget.dataset.goodsid;
    var goods = $that.data.cart;
    var cart = common.getStorage('cart', true);

    var price = 0;
    var freight = 0;
    // 刷新本页面购物车信息
    for (var i = 0; i < goods.length; ++i) {
      if (goods[i].goods_id == goods_id) {
        goods[i].cart_num++;
        price = parseFloat(goods[i].price);
        break;
      }
    }
    // 刷新存储的购物车信息
    for (var i = 0; i < cart.length; ++i) {
      if (cart[i].id == goods_id) {
        cart[i].num++;
        break;
      }
    }
    $that.setData({
      cart: goods,
      total_price: $that.data.total_price + price,
      total_goods: $that.data.total_goods + 1,
    });
    common.setStorage('cart', cart, true);
  },

  /**
   * 创建订单
   */
  createOrder: function (e) {
    var uniqueID = common.getStorage('uniqueID', true);
    if (!uniqueID) {
      wx.switchTab({
        url: '/pages/user/user',
      });
      return;
    }
    if (this.data.total_goods === 0) {
      wx.showToast({
        title: '购物车空空如也',
        icon: 'loading'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/order/deal',
    });
  },
})