<?php

namespace Home\Model;
use Think\Model;
class OrderModel extends Model {
    protected $tableName = 't_order'; 

	/** 
	 * 创建订单
     * @param array  $order_info 订单信息
     * @param array  $buy_args 购买地址信息
     * @param array  $accept_args 收货信息
	 * @return mixed 失败/成功插入记录id
	 */  
    public function create_order($order_info){
        // 插入数据
		$result = $this->table('t_order')->add($order_info);
    	return $result;
    }

    /** 
     * 添加订单商品信息
     * @param array  $order_info 订单信息
     * @return boolean 操作结果
     */  
    public function add_goods_2_order($order_goods){
        // 插入数据
        // ThinkPhp3.2.3 addAll字段被自动过滤导致写入失败
        // $result = $this->table('t_order_goods')->field('order_id,goods_id,goods_count')->addAll($order_goods);
        $result = true;
        foreach ($order_goods as $key => $value) {
            $result = $result && $this->table('t_order_goods')->field('order_id,goods_id,goods_count')->add($value);
        }
        return $result != false;
    }
    
    /** 
     * 关联用户与订单
     * @param string  $order_id 订单信息
     * @param string  $user_id 购买地址信息
     * @param string  $order_stamp 收货信息
     * @return boolean 插入结果
     */  
    public function bind_order_2_user($order_id, $user_id, $order_stamp){
        // 插入数据
        $data = array(
            'order_id'  => $order_id,
            'user_id'  => $user_id,
            'order_stamp'  => $order_stamp,
        );
        $result = $this->table('t_user_order')->field('order_id,user_id,order_stamp')->add($data);
        return $result != false;
    }

    /** 
     * 更新订单prepay_id
     * @param string  $order_id 订单id
     * @param string  $prepay_id 预订单信息
     * @return boolean 操作结果
     */  
    public function set_prepayid_2_order($order_id, $prepay_id){
        // 插入数据
        $condition = array(
            'id'  => $order_id,
        );
        $data = array(
            'prepay_id'  => $prepay_id,
        );
        $result = $this->table('t_order')->where($condition)->save($data);
        return $result != false;
    }

    /** 
     * 根据orderstamp获取订单信息
     * @param string $order_stamp 订单编号
     * @return array 订单
     */  
    public function get_order($order_stamp){
        $condition = array(
            'order_stamp' => $order_stamp,
        );
        // 获取订单内容
        $result = $this->table('v_order_meta')->where($condition)->select();
        return $result;
    }

    /** 
     * 更新订单支付状态
     * @param string $id 订单id
     * @param string $pay_status 支付状态
     * @param float $total_fee 总费用
     * @param string $pay_type 支付类型
     * @return boolean 操作结果
     */  
    public function update_pay_status($id, $pay_status, $total_fee, $pay_type){
        $condition = array(
            'id' => $id,
        );
        $data = array(
            'pay_status' => $pay_status,
            'pay_sum' => $total_fee,
            'pay_type' => $pay_type,
        );
        // 获取订单内容
        $result = $this->table('t_order')->where($condition)->save($data);
        return $result != false;
    }

    /** 
     * 分页获取订单列表
     * @param int $page 页码
     * @param int $num 页面容量
     * @return array 订单
     */  
    public function get_order_list($page = 1, $num = 10){
        // 获取订单内容
        $result = $this->table('v_order_meta')->order('id DESC')->page($page, $num)->select();
        return $result;
    }

    /** 
     * 分页获取订单列表
     * @param int $user_id 用户id
     * @param int $page 页码
     * @param int $num 页面容量
     * @return array 订单
     */  
    public function get_user_order_list($user_id, $page = 1, $num = 10){
        $condition = array(
            'user_id' => $user_id,
            'status' => 'normal',
        );
        // 获取订单内容
        $result = $this->table('v_order_meta')->where($condition)->order('id DESC')->page($page, $num)->select();
        return $result;
    }

    /** 
     * 根据订单id获取订单详细内容
     * @param int $order_id 订单id
     * @return array 订单详情
     */  
    public function get_order_detail($order_id){
        $condition = array(
            'order_id' => $order_id
        );
        // 获取订单内容
        $result = $this->table('v_order_detail')->where($condition)->select();
        return $result;
    }
}