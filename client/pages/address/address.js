// pages/my/address.js
const app = getApp()
var common = require('../../vendor/functions/common.js');
var vendor = require('../../vendor/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    point: null,
    fromUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 地址选择模式
    // 设置起点/终点、来源页面
    if (options.point && options.from) {
      this.setData({
        fromUrl: options.from,
        point: options.point
      });
    }
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
    var address = vendor.getStorage('address', true);
    if (!address) {
      address = [];
    }
    this.setData({
      address: address
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
   * 用户编辑地址
   */
  editAddress: function(e){
    var index = e.currentTarget.dataset.addressIndex;
    wx.navigateTo({
      url: '/pages/address/add?addressIndex=' + index,
    });
  },

  /**
   * 用户删除地址
   */
  delAddress: function (e) {
    var $that = this;
    wx.showModal({
      title: '删除地址',
      content: '确定要删除此地址？',
      success: function (res) {
        if (res.confirm) {
          var index = e.currentTarget.dataset.addressIndex;
          if (index == -1) {
            return;
          } else {
            var addresses = $that.data.address;
            if (addresses) {
              addresses.splice(index, 1);
            }
            $that.setData({
              address: addresses
            });
            vendor.setStorage('address', addresses, true);
            wx.showToast({
              title: '删除成功',
            });
          }
        }
      }
    });
  },

  /**
   * 用户选择地址
   */
  chooseAddress: function(e){
    // 非地址选择模式忽略
    if(!this.data.point){
      return;
    }
    var index = e.currentTarget.dataset.addressIndex;
    if (this.data.point === 'departure') {
      // 起点设置
      app.globalData.departure = this.data.address[index];
    }
    else if (this.data.point === 'destination') {
      // 终点设置
      app.globalData.destination = this.data.address[index];
    }

    // 返回来源页面
    var url = this.data.fromUrl;
    if (url) {
      wx.navigateBack({
        url: url
      });
    }
  }
})