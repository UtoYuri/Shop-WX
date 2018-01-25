<?php
namespace Home\Controller;
use Think\Controller;
class GoodsController extends Controller {

	public function index() {
		$this->ajaxReturn(array(
			'status' => false, 
			'err' => "未绑定action", 
		));
	}
	
	/**
	 * 获取商品列表
	 * @return json 
	*/
	public function get_goods_list() {
		// 获取请求参数
		$page = I('post.page/d', 1);
		$limit = I('post.limit/d', 10);

		try {
	        // 创建商品模型
	        $goods_model = D('Goods');
	        // 获取商品列表
	        $goods_list = $goods_model->get_goods_list($page, $limit);
			
		} catch (Exception $e) {
			// 回应请求
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "获取商品列表失败[".$e."]", 
			));
		}

		// 回应请求
		$this->ajaxReturn(array(
			'status' => true, 
			'goods_list' => $goods_list, 
			'err' => "", 
		));
	}

	/**
	 * 获取商品列表
	 * @return json 
	*/
	public function get_goods_list_in_cart() {
		// 获取请求参数
		$goods_ids = I('post.goods_ids/s', '');

		try {
	        // 创建商品模型
	        $goods_model = D('Goods');
	        // 获取商品列表
	        $goods_list = $goods_model->get_goods_list_in_cart($goods_ids);
			
		} catch (Exception $e) {
			// 回应请求
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "获取商品列表失败[".$e."]", 
			));
		}

		// 回应请求
		$this->ajaxReturn(array(
			'status' => true, 
			'goods_list' => $goods_list, 
			'err' => "", 
		));
	}

	/**
	 * 获取商品信息
	 * @return json 
	*/
	public function get_goods() {
		// 获取请求参数
		$goods_id = I('post.goods_id/d', 0);
		$openid = I('post.openid/s', '');

		// 获取商品信息
		try {
	        // 创建商品模型
	        $goods_model = D('Goods');
	        // 获取商品信息
	        $goods = $goods_model->get_goods($goods_id);
		} catch (Exception $e) {
			// 回应请求
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "获取商品信息失败[".$e."]", 
			));
			
		}

		// 添加浏览记录
		try {
	        // 创建用户模型
	        $user_model = D('User');
	        // 获取用户id
	        $user = $user_model->get_user_id($openid);
	        if (count($user) == 0){
	            $user_id = 0;
	        }else{
	            $user_id = $user[0]['id'];
	        }
	        // 更新商品浏览记录
	        $goods_model->view_once($user_id, $goods_id);
		} catch (Exception $e) {
			dump($e);
		}

		// 回应请求
		$this->ajaxReturn(array(
			'status' => true, 
			'goods' => $goods, 
			'err' => "", 
		));
	}

	/**
	 * 获取商品展示图片信息
	 * @return json 
	*/
	public function get_goods_banner() {
		// 获取请求参数
		$goods_id = I('post.goods_id/d', 0);

		// 获取商品信息
		try {
	        // 创建商品模型
	        $goods_model = D('Goods');
	        // 获取商品信息
	        $goods_banner = $goods_model->get_goods_banner($goods_id);
		} catch (Exception $e) {
			// 回应请求
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "获取商品展示图片失败[".$e."]", 
			));
		}

		// 回应请求
		$this->ajaxReturn(array(
			'status' => true, 
			'goods_banner' => $goods_banner, 
			'err' => "", 
		));
	}
}