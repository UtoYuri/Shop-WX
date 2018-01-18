<?php
/**
 * 微信小程序登录
 * @author		yuri	 <g.walkingfrog@gmail.com>
 * 微信登录文档:  https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wx.login
 * 使用示例
 *	//填写配置参数
 *	$options = array(
 *		'appid' 		=> 	C('WX_MINIAPP_ID'),		//填写微信小程序ID
 *		'secret'		=>	C('WX_MINIAPP_SECRET'),		//填写微信小程序秘钥
 *		'js_code'		=>	$code,		//填写微信小程序登录时获取的code
 *		'grant_type'	=>	'authorization_code'
 *	);
 *	//统一下单方法
 *	$wechatAppLogin = new wechatAppLogin($options);
 *	$result = $wechatAppLogin->getOpenID();
 *	return $result;
 */
class wechatAppLogin
{	
	//接口API URL前缀
	const API_URL_PREFIX = 'https://api.weixin.qq.com/sns/jscode2session?';
	//公众账号ID
	private $appid;
	//公众账号秘钥
	private $secret;
	//小程序登录时的code
	private $js_code;
	//authorization_code
	private $grant_type;
	//所有参数
	private $params = array();
	
	public function __construct($options)
	{
		$this->appid = isset($options['appid'])?$options['appid']:'';
		$this->secret = isset($options['secret'])?$options['secret']:'';
		$this->js_code = isset($options['js_code'])?$options['js_code']:'';
		$this->grant_type = isset($options['grant_type'])?$options['grant_type']:'';
	}
	
	/**
	 * 以get方式请求api接
	 * @return	mixed
	 */
	public function getUniqueID(){
		$queryString = $this->toUrlParams(array(
			'appid' => $this->appid, 
			'secret' => $this->secret, 
			'js_code' => $this->js_code, 
			'grant_type' => $this->grant_type, 
		));
		$response = $this->curlGet(self::API_URL_PREFIX.$queryString);
		$result = $this->json_to_array( $response );
		return $result;
	}

	/**
	 * 以get方式请求api接口
	 * 
	 * @param string $url  url
	 * @param bool $useCert 是否需要证书，默认不需要
	 * @param int $second   url执行超时时间，默认30s
	 * @return	mixed
	 */
	private function curlGet($url, $useCert = false, $second = 30){		
		$ch = curl_init();
		//设置超时
		curl_setopt($ch, CURLOPT_TIMEOUT, $second);
		
		curl_setopt($ch,CURLOPT_URL, $url);
		curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,FALSE);
		curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,2);
		//设置header
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		//要求结果为字符串且输出到屏幕上
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	
		if($useCert == true){
			//设置证书
			curl_setopt($ch,CURLOPT_SSLCERTTYPE,'PEM');
			curl_setopt($ch,CURLOPT_SSLKEYTYPE,'PEM');
		}
		//运行curl
		$data = curl_exec($ch);

		//返回结果
		if($data){
			curl_close($ch);
			return $data;
		} else { 
			$error = curl_errno($ch);
			curl_close($ch);
			return false;
		}
	}

	/**
	 * 将参数拼接为url: key=value&key=value
	 * @param	$params
	 * @return	string
	 */
	public function toUrlParams( $params ){
		$string = '';
		if( !empty($params) ){
			$array = array();
			foreach( $params as $key => $value ){
				$array[] = $key.'='.$value;
			}
			$string = implode("&",$array);
		}
		return $string;
	}


	/**
     * 将json转为array
     * @param string $json
	 * return array
     */
	public function json_to_array($json){	
		return json_decode($json, true);
	}
	
}