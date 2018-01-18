<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {

	public function index() {
		$this->ajaxReturn(array(
			'status' => false, 
			'err' => "未绑定action", 
		));
	}
	
	/**
	 * 获取商店基本信息
	 * @return json 
	*/
	public function get_shop_meta(){
		try {
	        // 创建商店模型
	        $shop_model = D('Shop');

	        // 获取商店详情
	        $shop_meta = $shop_model->get_shop_meta();
	        // 获取最新通知
	        $latest_notice = $shop_model->get_latest_notice();

		} catch (Exception $e) {
			// 回应请求
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "获取商店基本信息失败[".$e."]", 
			));
		}

		// 回应请求
		$this->ajaxReturn(array(
			'status' => true, 
			'shop_meta' => $shop_meta, 
			'latest_notice' => $latest_notice, 
			'err' => "", 
		));
	}


	/**
	 * 用户反馈
	 * @return json 
	*/
	public function post_feedback(){
		$contact = I('post.contact/s', '');
		$content = I('post.content/s', '');

		try {
	        // 创建商店模型
	        $shop_model = D('Shop');

	        // 获取商店详情
	        $result = $shop_model->post_feedback($contact, $content);

	        if (!$result){
				// 回应请求
				$this->ajaxReturn(array(
					'status' => false, 
					'err' => "写入反馈信息失败", 
				));
	        }
			
		} catch (Exception $e) {
			// 回应请求
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "反馈失败[".$e."]", 
			));
		}

		// 回应请求
		$this->ajaxReturn(array(
			'status' => true, 
			'err' => "", 
		));
	}
}