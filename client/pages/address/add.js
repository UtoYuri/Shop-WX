// pages/address/add.js
var common = require('../../vendor/functions/common.js');
var vendor = require('../../vendor/index');
var citys = require('../../vendor/utils/citys.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: [],
    citys: [],
    curProvinceIndex: 0,
    curCityIndex: 0,

    isPicking: false,
    isMale: true,
    addressIndex: -1,

    // 直观值
    name: '蝎子精',
    gender: '先生',
    phone: '13888888888',
    address: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    citys.init(this);
    var index = options.addressIndex;
    if (index){
      this.setData({
        addressIndex: index
      });
    }
    if (index >= 0) {
      var addresses = vendor.getStorage('address', true);
      if (addresses) {
        var address = addresses[index];
        var isMale = true;
        if (address.gender !== '先生'){
          isMale = false;
        }
        this.setData({
          name: address.name,
          gender: address.gender,
          phone: address.phone,
          address: address.address,
          isMale: isMale
        });
      }
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
   * 用户姓名变化
   */
  nameChanged: function (e) {
    console.log(e.detail.value);
    this.setData({
      name: e.detail.value
    });
  },
  
  /**
   * 用户电话变化
   */
  phoneChanged: function (e) {
    console.log(e.detail.value);
    if (!(/^1[34578]\d{9}$/.test(e.detail.value))) {
      wx.showToast({
        title: '请正确填写手机号码',
        icon: 'loading',
        duration: 1000
      });
      return;
    } 
    this.setData({
      phone: e.detail.value
    });
  },

  /**
   * 打开地区选择
   */
  openPicker: function(e){
    this.setData({
      isPicking: true
    });
  }, 

  /**
   * 关闭地区选择
   */
  closePicker: function(e) {
    this.setData({
      isPicking: false
    });
  }, 

  /**
   * 用户添加地区
   */
  pickerChanged: function (e) {
    var provinceIndex = e.detail.value[0];
    var cityIndex = e.detail.value[1];
    var $that = this;
    $that.setData({
      citys: $that.data.provinces[provinceIndex].sub,
      curCityIndex: cityIndex
    });
    $that.setData({
      address: common.utils.extend(this.data.address, {
        name: $that.data.provinces[provinceIndex].name + $that.data.citys[cityIndex].name,
        curProvinceIndex: provinceIndex
      })
    });
  },

  /**
   * 用户详细地址变化
   */
  addressChanged: function (e) {
    this.setData({
      address: common.utils.extend(this.data.address, {
        detail: e.detail.value
      })
    });
  },

  /**
   * 用户性别变化
   */
  genderChanged:function(e){
    this.setData({
      gender: e.detail.value
    });
  },

  /**
   * 保存地址
   */
  saveAddress: function () {
    var index = this.data.addressIndex;
    var name = this.data.name;
    var gender = this.data.gender;
    var phone = this.data.phone;
    var address = this.data.address;
    if (name.length === 0 
      || phone.length != 11 
      || !address.name
      || !address.detail){
      wx.showToast({
        title: '请完善信息',
        icon: 'loading'
      })
      return;
    }

    // 存储地址到本地
    var addresses = vendor.getStorage('address', true) || [];
    var address = {
      name: name,
      gender: gender,
      phone: phone,
      address: address
    };
    if (index == -1) {
      addresses.push(address);
    }else{
      addresses[index] = address;
    }
    vendor.setStorage('address', addresses, true);
    wx.navigateBack({
      url: '/pages/address/address',
    });
  },

  /**
   * 删除地址
   */
  delAddress: function (e) {
    var index = this.data.addressIndex;
    if (index == -1){
      wx.navigateBack({
        url: '/pages/address/address',
      });
    } else {
      var addresses = vendor.getStorage('address', true);
      if (addresses) {
        addresses.splice(index, 1);
      }
      vendor.setStorage('address', addresses, true);
      wx.navigateBack({
        url: '/pages/address/address',
      });
    }
  }
})