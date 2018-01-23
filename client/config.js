/**
 * 小程序配置文件
 */

// 主机域名
var protocol = 'http';
var host = 'localhost:666/server';

var config = {

  api: {
    // 获取商店基本信息
    getShopMeta: `${protocol}://${host}/Home/Index/get_shop_meta`,

    // 获取用户openid和unionid
    getUniqueID: `${protocol}://${host}/Home/Login/get_uniqueid`,

    // 获取购物车商品列表(通过若干goods_id获取)
    getGoodsListInCart: `${protocol}://${host}/Home/Goods/get_goods_list_in_cart`,

    // 获取商品列表
    getGoodsList: `${protocol}://${host}/Home/Goods/get_goods_list`,

    // 获取商品信息
    getGoods: `${protocol}://${host}/Home/Goods/get_goods`,

    // 获取商品展示图信息
    getGoodsBanner: `${protocol}://${host}/Home/Goods/get_goods_banner`,

    // 用户反馈
    postFeedback: `${protocol}://${host}/Home/Index/post_feedback`,

    // 生成预订单
    preOrder: `${protocol}://${host}/Home/Order/pre_order`,

    // 创建订单
    createOrder: `${protocol}://${host}/Home/Order/create_order`,

    // 查看订单
    getOrderList: `${protocol}://${host}/Home/Order/order_list`,

    // 查看物流
    getDeliveryStatus: `${protocol}://${host}/Home/Order/delivery_status`,
  }
};

module.exports = config;