// pages/index/index.js
var common = require('../../vendor/functions/common.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    limit: 10,
    isLoading: false,
    banner: "/source/banner.png",
    notice: "",
    hasNotice: false,
    goods: [],
    noticeAnimation: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $that = this;
    $that.getGoodsList(false);
    common.getShopMeta(function(data){
      console.log("商店信息", data);
      var hasNotice = false;
      var notice = "";
      var banner = $that.data.banner;
      var name = "超市";
      var contact = "13888888888";
      var description = "超市百货，应有尽有。";
      // 最新提示信息
      if (data.latest_notice.length > 0){
        hasNotice = true;
        notice = data.latest_notice[0].content;
        // 创建动画
        var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'linear',
        });
        // 循环执行
        var deg = [1.1, 1];
        var i = 0;
        setInterval(function () {
          animation.scale(deg[i]).step().scale(deg[(i + 1) % deg.length]).step();
          $that.setData({
            noticeAnimation: animation.export()
          });
          i = (i + 1) % deg.length;
        }, 3000);
      }
      // 商店信息
      for (var i = 0; i < data.shop_meta.length; ++i){
        if (data.shop_meta[i].key === 'banner'){
          banner = data.shop_meta[i].value;
        }
        if (data.shop_meta[i].key === 'name') {
          name = data.shop_meta[i].value;
        }
        if (data.shop_meta[i].key === 'contact') {
          contact = data.shop_meta[i].value;
        } 
        if (data.shop_meta[i].key === 'description') {
          description = data.shop_meta[i].value;
        } 
      }
      $that.setData({
        hasNotice: hasNotice,
        notice: notice,
        banner: banner,
      });
      common.setStorage('shop_meta', {
        name: name,
        contact: contact,
        banner: banner,
        description: description,
      }, false);
    }, function (error) {
      console.log("商店信息", error);
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
    this.getGoodsList(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getGoodsList(false);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 用户点击打开商品详情
   */
  showGoods: function(e){
    var goods_id = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '/pages/goods/goods?goods_id=' + goods_id
    });
  },

  /**
   * 用户点击打开菜单
   */
  showPage: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.direct
    });
  },

  /**
   * 用户获取商品列表
   */
  getGoodsList: function (isInit) {
    var $that = this;
    var limit = $that.data.limit;
    if (isInit) {
      var page = 1;
      var goods = [];
    } else {
      var isLoading = $that.data.isLoading;
      var page = $that.data.page;
      var goods = $that.data.goods;
      // 正在加载，忽略此次请求
      if (isLoading) {
        return;
      }
    }
    // 加载中标志
    $that.setData({
      isLoading: true
    });
    // 开始加载
    common.getGoodsList(page, limit, function (data) {
      console.log("商品列表", data);
      // 加载成功
      $that.setData({
        isLoading: false,
        page: page + 1,
        goods: common.utils.extend(goods, data.goods_list)
      });
    }, function (error) {
      // 加载失败
      console.log("商品列表", error);
      $that.setData({
        isLoading: false
      });
      wx.showToast({
        title: '加载商品列表失败，请重试。',
        icon: 'loading'
      });
    });
  },
})