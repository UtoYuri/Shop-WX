<?php

namespace Home\Model;
use Think\Model;
class GoodsModel extends Model {
    protected $tableName = 'v_goods_meta'; 


    /** 
     * 分页商品列表
     * @param int $page 页码
     * @param int $num 页面容量
     * @return array 商品列表
     */  
    public function get_goods_list($page = 1, $num = 10){
        // 获取商品详情
        $result = $this->table('v_goods_meta')->page($page, $num)->select();
        return $result;
    }

    /** 
     * 根据多个商品id获取商品列表
     * @param int  $goods_ids 多个商品id 逗号隔开
     * @return array 商品信息
     */  
    public function get_goods_list_in_cart($goods_ids){
        // 查询数据
        $result = $this->table('v_goods_meta')->where(array(
            'goods_id' => array('IN', $goods_ids),
        ))->select();
        return $result;
    }

    /** 
     * 根据商品id获取商品信息
     * @param int  $goods_id 商品id
     * @return array 商品信息
     */  
    public function get_goods($goods_id){
        // 查询数据
        $result = $this->table('v_goods_meta')->where(array(
            'goods_id' => $goods_id, 
        ))->select();
        return $result;
    }

    /** 
     * 根据商品id获取商品展示图片信息
     * @param int  $goods_id 商品id
     * @return array 商品展示图信息
     */  
    public function get_goods_banner($goods_id){
        // 查找数据
        $result = $this->table('v_goods_banner')->where(array(
            'goods_id' => $goods_id, 
        ))->select();
        return $result;
    }

    /** 
     * 插入浏览记录
     * @param int $user_id 用户id
     * @param int $goods_id 商品id
     * @return bool 操作结果
     */  
    public function view_once($user_id, $goods_id){
        $data = array (
            'user_id'   => $user_id,
            'goods_id'   => $goods_id,
        );
        // 插入数据
        $result = $this->table('t_record_view')->field('user_id,goods_id')->add($data);
        return $result != false;
    }
}