//logs.js
var vendor = require('../../vendor/index');

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return vendor.utils.formatTime(new Date(log))
      })
    })
  }
})
