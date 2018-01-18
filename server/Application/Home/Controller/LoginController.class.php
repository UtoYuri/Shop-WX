<?php
namespace Home\Controller;
use Think\Controller;
class LoginController extends Controller {

	public function index() {
		$this->ajaxReturn(array(
			'status' => false, 
			'err' => "未绑定action", 
		));
	}
	
	/**
	 * code encryptedData iv换取openid unionid
	 * @return json 
	*/
	public function get_uniqueid() {
		$code = I('post.code/s', '');
		$encryptedData = I('post.encryptedData/s', '');
		$iv = I('post.iv/s', '');

		try {
			// 微信登录
			$result = wxLogin($code, $encryptedData, $iv);
			// 登录失败
			if (isset($result['status']) && !$result['status']) {
				$this->ajaxReturn($result);
			}
		} catch (Exception $e) {
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "微信登录接口调用失败[".$e."]", 
			));
		}

		// 整合用户信息
		$unionid = isset($result['unionid'])?$result['unionid']:null;
		$openid = $result['openId'];
		$nickname = $result['nickName'];
		$gender = $result['gender'] == 1 ? "先生" : "女士";
		$city = $result['city'];
		$avatar_url = $result['avatarUrl'];
		$uinfo = array(
			"unionid"	=> isset($unionid)?$unionid:'',
			"openid"	=> $openid,
			"nickname"	=> $nickname,
			"gender" 	=> $gender,
			"city"		=> $city,
			"avatar_url"=> $avatar_url,
		);

		try {
	        // 创建用户模型
	        $user_model = D('User');
	        // 创建/更新用户信息
	        $result = $user_model->login($uinfo);
	        // 用户数据写入失败
	        if (!$result){
				$this->ajaxReturn(array(
					'status' => false, 
					'err' => '用户数据写入失败', 
				));
	        }
		} catch (Exception $e) {
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "用户数据写入失败[".$e."]", 
			));
		}

        // 登陆成功
		$this->ajaxReturn(array(
			'status' => true, 
			'openid' => $openid,
			'unionid' => $unionid,
			'err' => '', 
		));
	}
}