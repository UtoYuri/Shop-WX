// pages/order/deliver.js
var mta = require('../../vendor/utils/mta_analysis.js');
var common = require('../../vendor/functions/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deliveryCompany: '',
    deliveryNumber: '',
    deliveryStatus: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $that = this;
    var deliveryCompany = options.company;
    var deliveryNumber = options.number;
    $that.setData({
      deliveryCompany: $that.mapCompany(deliveryCompany),
      deliveryNumber: deliveryNumber,
    });
    common.getDeliveryStatus(deliveryCompany, deliveryNumber, function(data){
      console.log('物流信息', data);
      $that.setData({
        deliveryStatus: data.delivery_status
      });
    }, function(error){
      console.log('物流信息', error);
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
   * 快递公司
   */
  mapCompany: function (company) {
    if (company == 'shunfeng'){
      return '顺丰快递';
    }else{
      return company;
    }
  }
})