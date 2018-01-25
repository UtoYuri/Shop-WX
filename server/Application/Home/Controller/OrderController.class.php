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
		$openid = I('post.openid/s', '');
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
	        $user_id = $this->get_user_id($openid);
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
			'order_id' => $order_id, 
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
		$openid = I('post.openid/s', '');
		$order_id = I('post.order_id/s', '');

		// 预订单
		$data = wxPay($openid, $description, $price, C('HOST').U('Home/Order/pay_callback'));
		$status = true;
		if ($data['msg'] == 'FAIL'){
			$status = false;
		}

		$prepayid = $data['prepayid'] ? $data['prepayid'] : '';
		$timestamp = $data['timestamp'];
		$noncestr = $data['noncestr'];
		$sign = $data['sign'];
		$msg = $data['msg'];

		// 重新生成签名
		$params = array(
			'timeStamp'	=>	$timestamp,
			'nonceStr'	=>	$noncestr,
			'package'		=>	'prepay_id='.$prepayid,
			'signType'		=>	'MD5'
		);
		$SIGN = wxPayReSign($params);

		// 更新订单prepay_id(方便推送消息)
		try {
	        // 创建订单模型
	        $order_model = D('Order');
	        // 获取订单基本信息
	        $result = $order_model->set_prepayid_2_order($order_id, $prepayid);
	        if (!$result){
	        	$status = false;
	        	$err = "更新订单prepay_id失败";
	        }
		} catch (Exception $e) {
	        $status = false;
	        $err = "更新订单prepay_id失败[".$e."]";
		}

		// 回应请求
		$this->ajaxReturn(array(
			'status' => $status, 
			'prepayId' => $prepayid, 
			'mchId' => C('WX_MINIAPP_MCHID'),
			'nonceStr' => $noncestr, 
			'timeStamp' => $timestamp, 
			'sign' => $SIGN, 
			'msg' => $msg, 
			'err' => $err, 
		));
	}

	/**
	 * 付款成功回调
	*/
	public function pay_callback(){
		wxPayNotify(function($notifyData){
			// 验证签名
			$sign = $notifyData['sign'];	// 签名
			unset($notifyData['sign']);
			if ($sign != wxPayReSign($notifyData)){
				return;
			}

			$result_code = $notifyData['result_code'];	// 支付成功标志 SUCCESS/FAIL
			$appid = $notifyData['appid'];
			$err_code = $notifyData['err_code'];	// 错误返回信息描述
			$err_code_des = $notifyData['err_code_des'];	// 错误返回信息描述
			$openid = $notifyData['openid'];	// 用户openid
			$is_subscribe = $notifyData['is_subscribe'];	// 知否订阅公众号
			$total_fee = $notifyData['total_fee'];	// 订单总额
			$out_trade_no = $notifyData['out_trade_no'];	// 交易订单号 20180101...
			$time_end = $notifyData['time_end'];	// 完成时间
			$trade_type = $notifyData['trade_type'];	// 交易类型 JSAPI


			// 检查支付结果
			if ($result_code == 'FAIL'){
				return;
			}

			// 检查对应订单状态
			try {
		        // 创建订单模型
		        $order_model = D('Order');
		        // 获取订单基本信息
		        $order = $order_model->get_order($out_trade_no);
			} catch (Exception $e) {
				return;
			}
	        // 未知订单
	        if (count($order) == 0){
	        	return;
	        }

	        // 已处理订单
	        $order = $order[0];
	        if ($order['pay_status'] == 1){
	        	return;
	        }

        	$pay_status = 1;
			// 校验订单金额与收到的金额
	        if ($order['pay_sum'] * 100 != $total_fee){
	        	// 金额不匹配
	        	$pay_status = -1;
	        }
	        // 更新订单状态
	        $result = $order_model->update_pay_status($order['id'], $pay_status, $trade_type);

		}, function(){
			// 接收到通知但校验失败 如签名失败、参数格式校验错误
		});
	}

	/**
	 * 获取分页订单列表
	 * @return json 
	*/
	public function order_list(){
		// 获取请求参数
		$openid = I('post.openid/s', '');
		$page = I('post.page/d', 1);
		$limit = I('post.limit/d', 10);


		try {
	        // 获取用户id
	        $user_id = $this->get_user_id($openid);
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
	 * 根据快递公司和单号获取快递信息
	 * @return json 
	*/
	public function delivery_status(){
		// 获取请求参数
		$company = I('post.company/s', '');
		$number = I('post.number/s', '');


		try {
			$orderTraces = getOrderTraces($company, $number);
			$orderTraces = json_decode($orderTraces, true);
		} catch (Exception $e) {
	        // 回应请求
			$this->ajaxReturn(array(
				'status' => false, 
				'err' => "查询快递信息失败[".$e."]", 
			));
		}


		// 回应请求
		$this->ajaxReturn(array(
			'status' => true, 
			'delivery_status' => $orderTraces['data'], 
			'err' => "", 
		));
	}


	/** 
	 * 根据openid获取用户id
	 * @param string $openid openid
	 * @return int user_id 
	 */  
	private function get_user_id($openid){
        // 创建用户模型
        $user_model = D('User');
        // 获取用户id
        $user = $user_model->get_user_id($openid);
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
