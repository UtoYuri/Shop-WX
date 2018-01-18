<?php
return array(
	//'配置项'=>'配置值'

    /* 网站设置 */
    'HOST'                  =>  'your domain',

    /* 微信小程序信息 */
    'WX_MINIAPP_ID'             =>  'your appid',     // 微信小程序APPID
    'WX_MINIAPP_SECRET'         =>  'your appsecret',     // 微信小程序秘钥
    'WX_MINIAPP_MCHID'          =>  'your mchid',     // 商户号
    'WX_MINIAPP_APIKEY'         =>  'your key',     // 支付秘钥

	
    /* 数据库设置 */
    'DB_TYPE'               =>  'mysql',     // 数据库类型
    'DB_HOST'               =>  'localhost', // 服务器地址
    'DB_NAME'               =>  'small_shop',          // 数据库名
    'DB_USER'               =>  'root',      // 用户名
    'DB_PWD'                =>  'your db password',          // 密码
    'DB_PORT'               =>  '3306',        // 端口
    'DB_PREFIX'             =>  '',    // 数据库表前缀
    'DB_CHARSET'            =>  'utf8',      // 数据库编码默认采用utf8
    'DB_FIELDS_CACHE'       =>  false,   //字段缓存


    /* 默认设定 */
    'DEFAULT_MODULE'        =>  'Home',  // 默认模块
    'URL_MODEL'             =>  2,       // URL访问模式,可选参数0、1、2、3,代表以下四种模式：
    // 0 (普通模式); 1 (PATHINFO 模式); 2 (REWRITE  模式); 3 (兼容模式)  默认为PATHINFO 模式

);