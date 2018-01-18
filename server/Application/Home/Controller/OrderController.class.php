<?php
namespace Home\Controller;
use Think\Controller;
class OrderController extends Controller {

	public function index() {
		$this->ajaxReturn(array(
			'status' => false, 
			'err' => "未绑定action", 
		));
	}



	/**
	 * 创建订单
	 * @return json 
	*/
	public function create_order(){
		// 获取请求参数
		// 订单信息
		$unionid = I('post.unionid/s', '');
		$goods_in_order = I('post.goods_in_order/s', '');
		$goods_count = I('post.goods_count/d', 0);
		$price_sum = I('post.price_sum/f', 0);
		$freight_sum = I('post.freight_sum/f', 0);
		$remark = I('post.remark/s', '');
		// 收货人信息
		$destination = I('post.destination/s', '');
		$receiver = I('post.receiver/s', '');
		$phone = I('post.phone/s', '');


		try {
			// 检测价格和数量
			if (!$goods_count || !$price_sum){
		        // 回应请求
				$this->ajaxReturn(array(
					'status' => false, 
					'err' => "订单价格数量等信息校验不通过", 
				));
			}
			// 检测收货人信息
			if (!strlen($destination) || !strlen($receiver) || !checkPhone($phone)){
		        // 回应请求
				$this->ajaxReturn(array(
					'status' => false, 
					'err' => "收货地址校验不通过ooo", 
				));
			}

	        // 创建订单模型
	        $order_model = D('Order');

	        // 创建订单
	        $order_info = array(
	        	'goods_count'	=> $goods_count,
	        	'price_sum'		=> $price_sum,
	        	'freight_sum'	=> $freight_sum,
	        	'remark'		=> $remark,
	        	'destination'	=> $destination,
	        	'receiver'		=> $receiver,
	        	'phone'			=> $phone,
	        );
	        $result = $order_model->create_order($order_info);
			if (!$result){
		        // 回应请求
				$this->ajaxReturn(array(
					'status' => false, 
					'err' => "创建订单失败",
				));
			}
			// 添加商品信息到订单
			$order_id = $result;
			$order_goods = array();
			foreach (explode(',', $goods_in_order) as $key => $goods) {
				if (strlen($goods) == 0){
					continue;
				}
				$order = explode(':', $goods);
				$order_goods[] = array('order_id'=>$order_id, 'goods_id'=>$order[0], 'goods_count'=>$order[1]);
			}
	        $result = $order_model->add_goods_2_order($order_goods);
			if (!$result){
		        // 回应请求
				$this->ajaxReturn(array(
					'status' => false, 
					'err' => "添加商品到订单失败",
				));
			}

	        // 获取用户id
	        $user_id = $this->get_user_id($unionid);
	        // 订单编号
	        $order_stamp = create_order_stamp();
	        // 关联用户与订单
	        $result = $order_model->bind_order_2_user($order_id, $user_id, $order_stamp);
			if (!$result){
		        // 回应请求
				$this->ajaxReturn(array(
					'status' => false, 
					'err' => "关联用户与订单失败",
				));
			}

		} catch (Exception $e) {
	        // 回应请求
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "创建订单失败[".$e."]", 
			));
		}

        // 回应请求
		$this->ajaxReturn(array(
			'status' => true, 
			'err' => "", 
		));
	}

	/**
	 * 微信统一下单
	 * @return json 
	*/
	public function pre_order(){
		// 获取请求参数
		$description = I('post.description/s', '订单');
		$price = I('post.price/s', '100');
		$unionid = I('post.unionid/s', '');

		// 预订单
		$data = wxPay($unionid, $description, $price, C('HOST').U('Home/Order/pay_callback'));
		$status = true;
		if ($data['msg'] == 'FAIL'){
			$status = false;
		}

		$prepayid = $data['prepayid'] ? $data['prepayid'] : '';
		$timestamp = $data['timestamp'];
		$noncestr = $data['noncestr'];
		$sign = $data['sign'];
		$msg = $data['msg'];

		// 小程序重新生成签名
		$SIGN = wxPayReSign($timestamp, $noncestr, 'prepay_id='.$prepayid, 'MD5');

		// 回应请求
		$this->ajaxReturn(array(
			'status' => $status, 
			'prepayId' => $prepayid, 
			'mchId' => C('WX_MINIAPP_MCHID'),
			'nonceStr' => $noncestr, 
			'timeStamp' => $timestamp, 
			'sign' => $SIGN, 
			'msg' => $msg, 
		));
	}

	/**
	 * 付款成功回调
	*/
	public function pay_callback(){

	}

	/**
	 * 获取分页订单列表
	 * @return json 
	*/
	public function order_list(){
		// 获取请求参数
		$unionid = I('post.unionid/s', '');
		$page = I('post.page/d', 1);
		$limit = I('post.limit/d', 10);


		try {
	        // 获取用户id
	        $user_id = $this->get_user_id($unionid);
	        // 创建订单模型
	        $order_model = D('Order');
	        // 获取订单基本信息
	        $orders = $order_model->get_user_order_list($user_id, $page, $limit);

	        // 获取订单详情
	        foreach ($orders as $key => $order) {
	        	$orders[$key]['goods'] = $order_model->get_order_detail($order['id']);
	        }
			
		} catch (Exception $e) {
	        // 回应请求
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "查询订单列表失败[".$e."]", 
			));
		}


		// 回应请求
		$this->ajaxReturn(array(
			'status' => true, 
			'orders' => $orders, 
			'err' => "", 
		));
	}

	/** 
	 * 根据unionid获取用户id
	 * @param string $unionid 用户微信unionid
	 * @return int user_id 
	 */  
	private function get_user_id($unionid){
        // 创建用户模型
        $user_model = D('User');
        // 获取用户id
        $user = $user_model->get_user_id($unionid);
        if (count($user) == 0){
	        // 回应请求
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "登录信息校验失败", 
			));
        }else{
            $user_id = $user[0]['id'];
        }
        return $user_id;
	}


	/**
	 * 获取数据库前20条订单信息 测试接口
	 * @return json 
	*/
	public function t(){
        // 创建订单模型
        $order_model = D('Order');

        // 获取订单详情
        $order = $order_model->get_order_list(1, 20);

        dump($order);
	}
}