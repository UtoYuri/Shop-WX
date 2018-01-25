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
 *	微信支付结果处理
 * @param string $openid 用户openid
 * @param string $desc 订单描述
 * @param string $price 订单价格
 * @param string $callbackUrl 支付结果回调网址
 * @return string 
*/
function wxPayNotify($successCb, $failCb){
	include_once 'WechatAppPay.class.php';

	// 微信支付结果处理
	$wechatAppPay = new wechatAppPay();

	$notifyData = $wechatAppPay->getNotifyData();
	if (!$notifyData){
		$failCb();
	}else{
		$successCb($notifyData);
	}
	$wechatAppPay->replyNotify();
}

/**
 *	微信小程序支付二次签名
 * @param string $timeStamp 时间戳
 * @param string $nonceStr 随机字符串
 * @param string $package prepayid=...
 * @param string $signType 加密类型
 * @return string 
*/
function wxPayReSign($params){
	$params['appId'] = C('WX_MINIAPP_ID');
	//统一下单方法
	$wechatAppPay = new wechatAppPay();
	$sign = $wechatAppPay->MakeSign($params);
	return $sign;
}

/**
 * 获取微信AccessToken
 * @return  string AccessToken
 */
function getAccessToken(){
	$data = array(
        'grant_type' => 'client_credential',
        'appid' => C('WX_MINIAPP_ID'),
        'secret' => C('WX_MINIAPP_SECRET'),
    );

	$json = curlGet('https://api.weixin.qq.com/cgi-bin/token', $data);

	$output = json_decode($json, true);	
	
	//根据公司业务处理返回的信息......
	return $output['access_token'];
}

/**
 *	微信小程序推送模板信息
 * @param string $openid 接受者openid
 * @param string $template_id 模板id
 * @param string $page 点击跳转页面
 * @param string $form_id formId / prepay_id
 * @param array $data 模板内容
 * @return int errcode 错误码 
*/
function wxSendMessage($openid, $template_id, $page, $form_id, $data){
	$data = array(
		"touser"	=> $openid,
		"template_id"	=> $template_id,
		"page"	=> $page,
		"form_id"	=> $form_id,
		"data"	=> $data,
	);
	$jsonData = json_encode($data);
	$json = curlPost("https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=".getAccessToken(), $jsonData);

	$output = json_decode($json, true);	
	
	//根据公司业务处理返回的信息......
	return $output['errcode'];
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

 
/**
 * 查询订单物流轨迹
 * @param  string $company 快递公司(按照快递100文档对应)
 * @param  string $number 快递单号
 * @return  string 物流轨迹json
 */
function getOrderTraces($company, $number){
	$data = array(
        'type' => $company,
        'postid' => $number,
    );

	$result = curlGet('https://m.kuaidi100.com/query', $data);	
	
	//根据公司业务处理返回的信息......
	return $result;
}

/**
 *  get请求
 * @param  string $url 请求Url
 * @param  array $data 提交的数据 
 * @return url响应返回的html
 */
function curlGet($url, $data) {
	$url = $url.'?'.http_build_query($data);
    $curl = curl_init();  //初始化
	curl_setopt($curl,CURLOPT_URL,$url);  //设置url
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);

	$result = curl_exec($curl);
	if($result === false){
	    $result = curl_errno($curl);
	}
	curl_close($curl);
	return $result;
}
 
/**
 *  post提交数据 
 * @param  string $url 请求Url
 * @param  array $data 提交的数据 
 * @return url响应返回的html
 */
function curlPost($url, $data) {
    $curl = curl_init();  //初始化
	curl_setopt($curl,CURLOPT_URL,$url);  //设置url
	curl_setopt($curl,CURLOPT_HTTPAUTH,CURLAUTH_BASIC);  //设置http验证方法
	curl_setopt($curl,CURLOPT_HEADER,0);  //设置头信息
	curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);  //设置curl_exec获取的信息的返回方式
	curl_setopt($curl,CURLOPT_POST,1);  //设置发送方式为post请求
	curl_setopt($curl,CURLOPT_POSTFIELDS,$data);  //设置post的数据

	$result = curl_exec($curl);
	if($result === false){
	    $result = curl_errno($curl);
	}
	curl_close($curl);
	return $result;
}