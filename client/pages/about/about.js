// pages/about/about.js
var common = require('../../vendor/functions/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    enableAuthor: true,
    contact: '',
    shopName: '',
    description: '',

    authorName: '',
    authorContact: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.refer === 'index'){
      this.setData({
        enableAuthor: false
      });
    }
    // 获取商店信息
    var shop_meta = common.getStorage('shop_meta', true);
    this.setData({
      shopName: shop_meta.name || this.data.shopName,
      contact: shop_meta.contact || this.data.contact,
      description: shop_meta.description || this.data.description,
      banners: shop_meta.photo || this.data.photo,
      authorName: shop_meta.author_name || this.data.authorName,
      authorContact: shop_meta.author_contact || this.data.authorContact,
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
  
  }
})