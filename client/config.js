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

    // 生成预订单
    preOrder: `${protocol}://${host}/Order/Index/pre_order`,

    // 创建订单
    createOrder: `${protocol}://${host}/Order/Index/create_order`,

    // 查看订单
    orderList: `${protocol}://${host}/Order/Index/order_list`,
  }
};

module.exports = config;