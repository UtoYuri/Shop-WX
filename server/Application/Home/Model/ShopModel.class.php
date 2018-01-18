<?php

namespace Home\Model;
use Think\Model;
class ShopModel extends Model {
    protected $tableName = 't_shop_meta'; 

    /** 
     * 获取商店基本信息
     * @return array 商店信息
     */  
    public function get_shop_meta(){
        // 查询数据
        $result = $this->table('t_shop_meta')->select();
        return $result;
    }

    /** 
     * 反馈信息
     * @return boolean 操作结果
     */  
    public function post_feedback($contact, $content){
        // 插入数据
        $data = array(
            'contact'   => $contact,
            'content'   => $content,
        );
        $result = $this->table('t_feedback')->field('contact,content')->add($data);
        return $result != false;
    }

    /** 
     * 获取最新通知
     * @return array 通知信息
     */  
    public function get_latest_notice(){
        // 查询数据
        $result = $this->table('v_notice')->limit(1)->select();
        return $result;
    }
}