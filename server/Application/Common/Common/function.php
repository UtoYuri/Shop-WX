<?php

/** 
 * 生成订单号
 * @return string order_id
 */  
function create_order_stamp(){
	return date('YmdHis').rand(100000,999999);
}

/** 
 * 校验手机号码合法性
 * @param string $phone 手机号码
 * @return boolean isvalid 
 */  
function checkPhone($phone){
	$isMob="/^1[3-8]{1}[0-9]{9}$/";
	$isTel = "/^([0-9]{3,4}-)?[0-9]{7,8}$/";
	if(!preg_match($isMob, $phone) && !preg_match($isTel, $phone)){
		return false;
	}
	return true;
}

/**
 *	微信支付
 * @param string $openid 用户openid
 * @param string $desc 订单描述
 * @param string $price 订单价格
 * @param string $callbackUrl 支付结果回调网址
 * @return string 
*/
function wxPay($openid, $desc, $price, $callbackUrl){
	include_once 'WechatAppPay.class.php';

	$APP_ID = C('WX_MINIAPP_ID');
	$MCH_ID = C('WX_MINIAPP_MCHID');
	$API_KEY = C('WX_MINIAPP_APIKEY');
	$TRADE_TYPE = 'JSAPI';

	//填写配置参数
	$options = array(
		'appid' 	=> 	$APP_ID,		//填写微信分配的公众开放账号ID
		'openid' 	=> 	$openid,		//openid
		'mch_id'	=>	$MCH_ID,		//填写微信支付分配的商户号
		'notify_url'=>	$callbackUrl,		//填写微信支付结果回调地址
		'key'		=>	$API_KEY	//填写  商户支付密钥Key。审核通过后，在微信发送的邮件中查看
	);
	//统一下单方法
	$wechatAppPay = new wechatAppPay($options);
	$params['body'] = $desc;						//商品描述
	$params['out_trade_no'] = create_order_stamp();	//自定义的订单号
	$params['total_fee'] = $price;					//订单金额 只能为整数 单位为分
	$params['trade_type'] = $TRADE_TYPE;			//交易类型 JSAPI | NATIVE | APP | WAP 
	$result = $wechatAppPay->unifiedOrder( $params );
	// dump($result);
	//创建APP端预支付参数
	/** @var TYPE_NAME $result */
	$data = $wechatAppPay->getAppPayParams( $result['prepay_id'] );
	$data['msg'] = $result['return_msg'];
	// dump($data);
	return $data;
}

/**
 *	微信小程序支付二次签名
 * @param string $timeStamp 时间戳
 * @param string $nonceStr 随机字符串
 * @param string $package prepayid=...
 * @param string $signType 加密类型
 * @return string 
*/
function wxPayReSign($timeStamp, $nonceStr, $package, $signType){
	$APP_ID = C('WX_MINIAPP_ID');
	$MCH_ID = C('WX_MINIAPP_MCHID');
	$API_KEY = C('WX_MINIAPP_APIKEY');

	//填写配置参数
	$options = array(
		'appid' 	=> 	$APP_ID,		//填写微信分配的公众开放账号ID
		'mch_id'	=>	$MCH_ID,		//填写微信支付分配的商户号
		'notify_url'=>	$callbackUrl,		//填写微信支付结果回调地址
		'key'		=>	$API_KEY	//填写  商户支付密钥Key。审核通过后，在微信发送的邮件中查看
	);
	$params = array(
		'appId' 	=> 	$APP_ID,
		'timeStamp'	=>	$timeStamp,
		'nonceStr'	=>	$nonceStr,
		'package'		=>	$package,
		'signType'		=>	$signType
	);
	//统一下单方法
	$wechatAppPay = new wechatAppPay($options);
	// print_r($params);
	$sign = $wechatAppPay->MakeSign($params);
	// print_r($sign);
	return $sign;
}

/**
 *	微信登录
 * @param string $code 微信登录返回code
 * @param string $encryptedData 加密后用户信息
 * @param string $iv 秘钥
 * @return array 
*/
function wxLogin($code, $encryptedData, $iv){
	include_once 'WechatAppLogin.class.php';
	include_once "wxBizDataCrypt.php";

	//填写配置参数
	$options = array(
		'appid' 		=> 	C('WX_MINIAPP_ID'),		//填写微信分配的公众开放账号ID
		'secret'		=>	C('WX_MINIAPP_SECRET'),		//填写微信分配的公众开放账号秘钥
		'js_code'		=>	$code,		//填写微信小程序登录时获取的code
		'grant_type'	=>	'authorization_code'
	);
	//登录
	$wechatAppLogin = new wechatAppLogin($options);
	$result = $wechatAppLogin->getUniqueID();
	if (isset($result['errcode'])) {
		return array(
			'status' => false, 
			'err' => 'code['.$result['errcode'].'] msg['.$result['errmsg'].']', 
		);
	}
	$sessionKey = $result['session_key'];

	$pc = new WXBizDataCrypt(C('WX_MINIAPP_ID'), $sessionKey);
	$errCode = $pc->decryptData($encryptedData, $iv, $data );

	if ($errCode == 0) {
		return $wechatAppLogin->json_to_array($data);;
	} else {
		return array(
			'status' => false, 
			'err' => 'code['.$errCode.']', 
		);
	}
}