var vendor = require('../../vendor/index');
var config = require('../../config');

/**
 * 获取商店基本信息
 */
var getShopMeta = function (successCb, failedCb) {
  var $that = this;
  vendor.request({
    url: config.api.getShopMeta,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET'
  }, {
    success: function (data) {
      successCb && successCb(data);
    },
    failed: function (error) {
      failedCb && failedCb(error);
    },
  });
}

/**
 * 用户反馈
 */
var postFeedback = function (contact, content, successCb, failedCb) {
  var $that = this;
  vendor.request({
    url: config.api.postFeedback,
    data: {
      contact: contact,
      content: content,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  }, {
    success: function (data) {
      successCb && successCb(data);
    },
    failed: function (error) {
      failedCb && failedCb(error);
    },
  });
}

/**
 * 通过code, encryptedData, iv解密用户uniqueid
 */
var getUniqueID = function (code, encryptedData, iv, successCb, failedCb) {
  var $that = this;
  if (code.length == 0) {
    return;
  }
  vendor.request({
    url: config.api.getUniqueID,
    data: {
      code: code,
      encryptedData: encryptedData,
      iv: iv,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  }, {
    success: function (data) {
      successCb && successCb(data);
    },
    failed: function (error) {
      failedCb && failedCb(error);
    },
  });
}


/**
 * 获取购物车商品列表
 * goods_ids 逗号隔开的商品id
 */
var getGoodsListInCart = function (goods_ids, successCb, failedCb) {
  var $that = this;
  if (goods_ids.length <= 0) {
    return;
  }
  vendor.request({
    url: config.api.getGoodsListInCart,
    data: {
      goods_ids: goods_ids,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  }, {
    success: function (data) {
      successCb && successCb(data);
    },
    failed: function (error) {
      failedCb && failedCb(error);
    },
  });
}

/**
 * 获取商品列表
 */
var getGoodsList = function (page, limit, successCb, failedCb) {
  var $that = this;
  if (page <= 0 || limit <= 0) {
    return;
  }
  vendor.request({
    url: config.api.getGoodsList,
    data: {
      page: page,
      limit: limit,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  }, {
    success: function (data) {
      successCb && successCb(data);
    },
    failed: function (error) {
      failedCb && failedCb(error);
    },
  });
}

/**
 * 获取商品信息
 */
var getGoods = function (openid, goods_id, successCb, failedCb) {
  var $that = this;
  if (goods_id <= 0) {
    wx.showToast({
      title: '商品不存在',
      icon: 'loading'
    });
    return;
  }
  vendor.request({
    url: config.api.getGoods,
    data: {
      openid: openid,
      goods_id: goods_id,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  }, {
    success: function (data) {
      successCb && successCb(data);
    },
    failed: function (error) {
      failedCb && failedCb(error);
    },
  });
}

/**
 * 获取商品展示图信息
 */
var getGoodsBanner = function (goods_id, successCb, failedCb) {
  var $that = this;
  if (goods_id <= 0) {
    wx.showToast({
      title: '商品不存在',
      icon: 'loading'
    });
    return;
  }
  vendor.request({
    url: config.api.getGoodsBanner,
    data: {
      goods_id: goods_id,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  }, {
    success: function (data) {
      successCb && successCb(data);
    },
    failed: function (error) {
      failedCb && failedCb(error);
    },
  });
}


/**
 * 获取我的订单
 */
var getOrderList = function (openid, page, limit, successCb, failedCb) {
  var $that = this;
  if (page <= 0 || limit <= 0) {
    return;
  }
  vendor.request({
    url: config.api.getOrderList,
    data: {
      openid: openid,
      page: page,
      limit: limit,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  }, {
    success: function (data) {
      successCb && successCb(data);
    },
    failed: function (error) {
      failedCb && failedCb(error);
    },
  });
}


/**
 * 获取物流信息
 */
var getDeliveryStatus = function (deliveryCompany, deliveryNumber, successCb, failedCb) {
  var $that = this;
  if (!deliveryCompany || !deliveryNumber) {
    return;
  }
  vendor.request({
    url: config.api.getDeliveryStatus,
    data: {
      company: deliveryCompany,
      number: deliveryNumber,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  }, {
    success: function (data) {
      successCb && successCb(data);
    },
    failed: function (error) {
      failedCb && failedCb(error);
    },
  });
}


/**
 * 预下订单
 */
var preOrder = function (order_id, openid, price, description, successCb, failedCb) {
  var $that = this;
  if (price <= 0) {
    return;
  }
  vendor.request({
    url: config.api.preOrder,
    data: {
      price: '' + price,
      description: description,
      order_id: order_id,
      openid: openid
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  }, {
    success: function (data) {
      successCb && successCb(data);
    },
    failed: function (error) {
      failedCb && failedCb(error);
    },
  });
}

/**
 * 创建订单
 */
var createOrder = function (openid, order, destination, successCb, failedCb) {
  var $that = this;
  if (!openid || !destination.address || !order.goods_count) {
      wx.showToast({
        title: '订单不完善',
        icon: 'loading',
      });
    return;
  }
  vendor.request({
    url: config.api.createOrder,
    data: {
      openid: openid,

      goods_in_order: order.goods_in_order,
      goods_count: order.goods_count,
      price_sum: order.price_sum,
      freight_sum: order.freight_sum,
      remark: order.remark,

      destination: destination.address.name + ' ' + destination.address.detail,
      receiver: destination.name,
      phone: destination.phone,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  }, {
    success: function (data) {
      successCb && successCb(data);
    },
    failed: function (error) {
      failedCb && failedCb(error);
    },
  });
}

module.exports = {
  // 基础功能
  utils: vendor.utils,
  setStorage: vendor.setStorage,
  getStorage: vendor.getStorage,

  // 网络请求
  getShopMeta: getShopMeta,
  postFeedback: postFeedback,
  getUniqueID: getUniqueID,
  
  getGoodsListInCart: getGoodsListInCart,
  getGoodsList: getGoodsList,
  getGoods: getGoods,
  getGoodsBanner: getGoodsBanner,
  getDeliveryStatus: getDeliveryStatus,

  getOrderList: getOrderList,
  preOrder: preOrder,
  createOrder: createOrder, 
}

