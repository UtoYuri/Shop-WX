-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 2018-01-23 09:14:53
-- 服务器版本： 5.7.19
-- PHP Version: 5.6.31

SET SQL_MODE = "";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `small_shop`
--

-- --------------------------------------------------------

--
-- 表的结构 `t_feedback`
--

DROP TABLE IF EXISTS `t_feedback`;
CREATE TABLE IF NOT EXISTS `t_feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact` varchar(50) COLLATE utf8_bin NOT NULL,
  `content` varchar(500) COLLATE utf8_bin NOT NULL,
  `post_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT 'normal',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='反馈信息表';

--
-- 转存表中的数据 `t_feedback`
--

INSERT INTO `t_feedback` (`id`, `contact`, `content`, `post_at`, `status`) VALUES
(1, '13888888888', '刚收到货，葫芦娃真是太棒了！', '2018-01-18 02:52:16', 'normal');

-- --------------------------------------------------------

--
-- 表的结构 `t_gallery`
--

DROP TABLE IF EXISTS `t_gallery`;
CREATE TABLE IF NOT EXISTS `t_gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(200) COLLATE utf8_bin NOT NULL,
  `description` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `post_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT 'normal',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='图片资源表';

--
-- 转存表中的数据 `t_gallery`
--

INSERT INTO `t_gallery` (`id`, `url`, `description`, `post_at`, `status`) VALUES
(1, '/source/1.png', '葫芦娃-大娃', '2018-01-16 15:18:33', 'normal'),
(2, '/source/2.png', '葫芦娃-二娃', '2018-01-16 15:19:04', 'normal'),
(3, '/source/3.png', '葫芦娃-三娃', '2018-01-16 15:19:37', 'normal'),
(4, '/source/4.png', '葫芦娃-四娃', '2018-01-16 15:19:54', 'normal'),
(5, '/source/5.png', '葫芦娃-五娃', '2018-01-16 15:20:16', 'normal'),
(6, '/source/6.png', '葫芦娃-六娃', '2018-01-17 02:03:01', 'normal'),
(7, '/source/7.png', '葫芦娃-七娃', '2018-01-17 02:03:06', 'normal');

-- --------------------------------------------------------

--
-- 表的结构 `t_goods`
--

DROP TABLE IF EXISTS `t_goods`;
CREATE TABLE IF NOT EXISTS `t_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `priority` int(11) NOT NULL DEFAULT '1',
  `name` varchar(200) COLLATE utf8_bin NOT NULL,
  `price` float NOT NULL DEFAULT '0',
  `freight` float NOT NULL DEFAULT '0',
  `delivery_type` varchar(50) COLLATE utf8_bin NOT NULL,
  `description` text COLLATE utf8_bin NOT NULL,
  `stock` int(11) NOT NULL DEFAULT '99999',
  `post_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT 'normal',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='商品信息表';

--
-- 转存表中的数据 `t_goods`
--

INSERT INTO `t_goods` (`id`, `priority`, `name`, `price`, `freight`, `delivery_type`, `description`, `stock`, `post_at`, `status`) VALUES
(1, 1, '葫芦娃大娃 - 低价甩卖', 99, 0, '顺丰包邮', '葫芦娃大娃 - 低价甩卖', 99999, '2018-01-16 15:23:27', 'normal'),
(5, 1, '葫芦娃五娃 - 低价甩卖', 99, 0, '顺丰包邮', '葫芦娃五娃 - 低价甩卖', 99999, '2018-01-16 15:24:14', 'normal'),
(6, 1, '葫芦娃六娃 - 低价甩卖', 99, 0, '顺丰包邮', '葫芦娃六娃 - 低价甩卖', 99999, '2018-01-16 15:23:27', 'normal'),
(2, 1, '葫芦娃二娃 - 低价甩卖', 99, 0, '顺丰包邮', '葫芦娃二娃 - 低价甩卖', 99999, '2018-01-16 15:24:14', 'normal'),
(4, 1, '葫芦娃四娃 - 低价甩卖', 99, 0, '顺丰包邮', '葫芦娃四娃 - 低价甩卖', 99999, '2018-01-16 15:23:27', 'normal'),
(3, 1, '葫芦娃三娃 - 低价甩卖', 99, 0, '顺丰包邮', '葫芦娃三娃 - 低价甩卖', 99999, '2018-01-16 15:23:27', 'normal'),
(7, 1, '葫芦娃七娃 - 低价甩卖', 99, 0, '顺丰包邮', '葫芦娃七娃 - 低价甩卖', 99999, '2018-01-16 15:23:27', 'normal');

-- --------------------------------------------------------

--
-- 表的结构 `t_goods_images`
--

DROP TABLE IF EXISTS `t_goods_images`;
CREATE TABLE IF NOT EXISTS `t_goods_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goods_id` int(11) NOT NULL,
  `image_id` int(11) NOT NULL,
  `type` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT 'banner',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='商品关联图片表';

--
-- 转存表中的数据 `t_goods_images`
--

INSERT INTO `t_goods_images` (`id`, `goods_id`, `image_id`, `type`) VALUES
(1, 1, 1, 'cover'),
(2, 2, 2, 'cover'),
(3, 3, 3, 'cover'),
(4, 4, 4, 'cover'),
(5, 5, 5, 'cover'),
(6, 6, 5, 'cover'),
(7, 7, 7, 'cover'),
(8, 1, 1, 'banner'),
(9, 2, 2, 'banner'),
(10, 3, 3, 'banner'),
(11, 4, 4, 'banner'),
(12, 5, 5, 'banner'),
(13, 6, 5, 'banner'),
(14, 7, 7, 'banner');

-- --------------------------------------------------------

--
-- 表的结构 `t_notice`
--

DROP TABLE IF EXISTS `t_notice`;
CREATE TABLE IF NOT EXISTS `t_notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(200) COLLATE utf8_bin NOT NULL,
  `priority` int(11) NOT NULL DEFAULT '1',
  `post_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_at` timestamp NOT NULL,
  `status` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT 'normal',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='通知表';

--
-- 转存表中的数据 `t_notice`
--

INSERT INTO `t_notice` (`id`, `content`, `priority`, `post_at`, `end_at`, `status`) VALUES
(1, '开业大吉，全场葫芦娃顺丰包邮！', 1, '2018-01-16 01:32:22', '2018-02-28 00:00:00', 'normal');

-- --------------------------------------------------------

--
-- 表的结构 `t_order`
--

DROP TABLE IF EXISTS `t_order`;
CREATE TABLE IF NOT EXISTS `t_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goods_count` int(11) NOT NULL DEFAULT '1',
  `price_sum` float NOT NULL,
  `freight_sum` float NOT NULL,
  `remark` varchar(500) COLLATE utf8_bin DEFAULT NULL,
  `pay_status` int(11) NOT NULL DEFAULT '0',
  `pay_type` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `pay_sum` float DEFAULT NULL,
  `destination` varchar(200) COLLATE utf8_bin NOT NULL,
  `receiver` varchar(50) COLLATE utf8_bin NOT NULL,
  `phone` varchar(20) COLLATE utf8_bin NOT NULL,
  `delivery_company` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `delivery_number` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT 'normal',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='订单表';

--
-- 转存表中的数据 `t_order`
--

INSERT INTO `t_order` (`id`, `goods_count`, `price_sum`, `freight_sum`, `remark`, `pay_status`, `pay_type`, `pay_sum`, `destination`, `receiver`, `phone`, `delivery_company`, `delivery_number`, `create_at`, `status`) VALUES
(1, 1, 99, 0, '我要会喷火的葫芦娃。', 1, 'wechat', 99, '河北省石家庄市 123', '蝎子精', '13888888888', 'shunfeng', '789601966832', '2018-01-23 16:42:40', 'normal');

-- --------------------------------------------------------

--
-- 表的结构 `t_order_goods`
--

DROP TABLE IF EXISTS `t_order_goods`;
CREATE TABLE IF NOT EXISTS `t_order_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `goods_id` int(11) NOT NULL,
  `goods_count` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='订单关联商品表';

--
-- 转存表中的数据 `t_order_goods`
--

INSERT INTO `t_order_goods` (`id`, `order_id`, `goods_id`, `goods_count`) VALUES
(1, 1, 2, 1);

-- --------------------------------------------------------

--
-- 表的结构 `t_record_view`
--

DROP TABLE IF EXISTS `t_record_view`;
CREATE TABLE IF NOT EXISTS `t_record_view` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `goods_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `view_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='浏览记录表';

--
-- 转存表中的数据 `t_record_view`
--

INSERT INTO `t_record_view` (`id`, `goods_id`, `user_id`, `view_at`) VALUES
(1, 1, 1, '2018-01-23 16:40:38');

-- --------------------------------------------------------

--
-- 表的结构 `t_shop_meta`
--

DROP TABLE IF EXISTS `t_shop_meta`;
CREATE TABLE IF NOT EXISTS `t_shop_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(200) COLLATE utf8_bin NOT NULL,
  `value` varchar(200) COLLATE utf8_bin NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='商店基本信息表';

--
-- 转存表中的数据 `t_shop_meta`
--

INSERT INTO `t_shop_meta` (`id`, `key`, `value`, `create_at`) VALUES
(1, 'banner', '/source/banner.png', '2018-01-17 01:08:47'),
(2, 'name', '爷爷的葫芦藤', '2018-01-17 01:09:09'),
(3, 'contact', '13888888888', '2018-01-17 01:10:16'),
(4, 'description', '爷爷种的葫芦藤现在结果啦', '2018-01-17 18:01:45'),
(5, 'author_name', '白蛙', '2018-01-19 00:33:07'),
(6, 'author_contact', 'g.walkingfrog@gmail.com', '2018-01-19 00:33:07'),
(7, 'photo', '/source/menu1.png', '2018-01-19 00:33:49'),
(8, 'photo', '/source/menu2.png', '2018-01-19 00:33:49'),
(9, 'photo', '/source/menu3.png', '2018-01-19 00:34:01'),
(10, 'shop_host', '老爷爷', '2018-01-19 00:45:45'),
(11, 'wxqr', '/source/qr.png', '2018-01-19 00:50:37');

-- --------------------------------------------------------

--
-- 表的结构 `t_user`
--

DROP TABLE IF EXISTS `t_user`;
CREATE TABLE IF NOT EXISTS `t_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `union_id` varchar(50) COLLATE utf8_bin NOT NULL,
  `nickname` varchar(100) COLLATE utf8_bin NOT NULL,
  `gender` varchar(10) COLLATE utf8_bin NOT NULL,
  `city` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `avatar_url` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT 'normal',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='用户表';

--
-- 转存表中的数据 `t_user`
--

INSERT INTO `t_user` (`id`, `union_id`, `nickname`, `gender`, `city`, `avatar_url`, `last_login`, `status`) VALUES
(1, 'oLUGt4n-q5Zu3IMBwmh3TPKiua9E', '白蛙', '先生', 'Suqian', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epbnxl692C9fqMrojiaictf7qJcmYTp5vpHqWeyfQeZicXqNgUzzkcMrQlI0T41Wp91Wtbyrvn78KVhA/0', '2018-01-23 16:40:25', 'normal');

-- --------------------------------------------------------

--
-- 表的结构 `t_user_order`
--

DROP TABLE IF EXISTS `t_user_order`;
CREATE TABLE IF NOT EXISTS `t_user_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `order_stamp` varchar(20) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_stamp` (`order_stamp`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='用户关联订单表';

--
-- 转存表中的数据 `t_user_order`
--

INSERT INTO `t_user_order` (`id`, `user_id`, `order_id`, `order_stamp`) VALUES
(1, 1, 1, '20180123164240652941');

-- --------------------------------------------------------

--
-- 替换视图以便查看 `v_goods_banner`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `v_goods_banner`;
CREATE TABLE IF NOT EXISTS `v_goods_banner` (
`goods_id` int(11)
,`banner` varchar(200)
,`post_at` timestamp
);

-- --------------------------------------------------------

--
-- 替换视图以便查看 `v_goods_meta`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `v_goods_meta`;
CREATE TABLE IF NOT EXISTS `v_goods_meta` (
`goods_id` int(11)
,`priority` int(11)
,`name` varchar(200)
,`cover` varchar(200)
,`price` float
,`freight` float
,`delivery_type` varchar(50)
,`stock` int(11)
,`view_count` bigint(21)
,`description` text
,`post_at` timestamp
,`status` varchar(20)
);

-- --------------------------------------------------------

--
-- 替换视图以便查看 `v_notice`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `v_notice`;
CREATE TABLE IF NOT EXISTS `v_notice` (
`id` int(11)
,`content` varchar(200)
,`priority` int(11)
,`post_at` timestamp
,`end_at` timestamp
,`status` varchar(20)
);

-- --------------------------------------------------------

--
-- 替换视图以便查看 `v_order_detail`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `v_order_detail`;
CREATE TABLE IF NOT EXISTS `v_order_detail` (
`order_id` int(11)
,`goods_id` int(11)
,`name` varchar(200)
,`cover` varchar(200)
,`price` float
,`freight` float
,`delivery_type` varchar(50)
,`description` text
,`goods_count` int(11)
);

-- --------------------------------------------------------

--
-- 替换视图以便查看 `v_order_meta`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `v_order_meta`;
CREATE TABLE IF NOT EXISTS `v_order_meta` (
`id` int(11)
,`order_stamp` varchar(20)
,`user_id` int(11)
,`goods_count` int(11)
,`price_sum` float
,`freight_sum` float
,`remark` varchar(500)
,`pay_status` int(11)
,`pay_type` varchar(20)
,`pay_sum` float
,`destination` varchar(200)
,`receiver` varchar(50)
,`phone` varchar(20)
,`delivery_number` varchar(30)
,`delivery_company` varchar(20)
,`create_at` timestamp
,`status` varchar(20)
);

-- --------------------------------------------------------

--
-- 视图结构 `v_goods_banner`
--
DROP TABLE IF EXISTS `v_goods_banner`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_goods_banner`  AS  select `t_goods`.`id` AS `goods_id`,`t_gallery`.`url` AS `banner`,`t_gallery`.`post_at` AS `post_at` from ((`t_goods` left join `t_goods_images` on(((`t_goods`.`id` = `t_goods_images`.`goods_id`) and (`t_goods_images`.`type` = 'banner')))) left join `t_gallery` on((`t_gallery`.`id` = `t_goods_images`.`image_id`))) where (`t_goods`.`status` = 'normal') ;

-- --------------------------------------------------------

--
-- 视图结构 `v_goods_meta`
--
DROP TABLE IF EXISTS `v_goods_meta`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_goods_meta`  AS  select `t_goods`.`id` AS `goods_id`,`t_goods`.`priority` AS `priority`,`t_goods`.`name` AS `name`,`t_gallery`.`url` AS `cover`,`t_goods`.`price` AS `price`,`t_goods`.`freight` AS `freight`,`t_goods`.`delivery_type` AS `delivery_type`,`t_goods`.`stock` AS `stock`,count(`t_record_view`.`id`) AS `view_count`,`t_goods`.`description` AS `description`,`t_goods`.`post_at` AS `post_at`,`t_goods`.`status` AS `status` from (((`t_goods` left join `t_goods_images` on(((`t_goods`.`id` = `t_goods_images`.`goods_id`) and (`t_goods_images`.`type` = 'cover')))) left join `t_gallery` on((`t_gallery`.`id` = `t_goods_images`.`image_id`))) left join `t_record_view` on((`t_record_view`.`goods_id` = `t_goods`.`id`))) where (`t_goods`.`status` = 'normal') group by `goods_id` order by `t_goods`.`priority` desc ;

-- --------------------------------------------------------

--
-- 视图结构 `v_notice`
--
DROP TABLE IF EXISTS `v_notice`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_notice`  AS  select `t_notice`.`id` AS `id`,`t_notice`.`content` AS `content`,`t_notice`.`priority` AS `priority`,`t_notice`.`post_at` AS `post_at`,`t_notice`.`end_at` AS `end_at`,`t_notice`.`status` AS `status` from `t_notice` where (`t_notice`.`end_at` > now()) order by `t_notice`.`post_at` desc ;

-- --------------------------------------------------------

--
-- 视图结构 `v_order_detail`
--
DROP TABLE IF EXISTS `v_order_detail`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_order_detail`  AS  select `v_order_meta`.`id` AS `order_id`,`v_goods_meta`.`goods_id` AS `goods_id`,`v_goods_meta`.`name` AS `name`,`v_goods_meta`.`cover` AS `cover`,`v_goods_meta`.`price` AS `price`,`v_goods_meta`.`freight` AS `freight`,`v_goods_meta`.`delivery_type` AS `delivery_type`,`v_goods_meta`.`description` AS `description`,`t_order_goods`.`goods_count` AS `goods_count` from ((`v_order_meta` left join `t_order_goods` on((`t_order_goods`.`order_id` = `v_order_meta`.`id`))) left join `v_goods_meta` on((`v_goods_meta`.`goods_id` = `t_order_goods`.`goods_id`))) ;

-- --------------------------------------------------------

--
-- 视图结构 `v_order_meta`
--
DROP TABLE IF EXISTS `v_order_meta`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_order_meta`  AS  select `t_order`.`id` AS `id`,`t_user_order`.`order_stamp` AS `order_stamp`,`t_user_order`.`user_id` AS `user_id`,`t_order`.`goods_count` AS `goods_count`,`t_order`.`price_sum` AS `price_sum`,`t_order`.`freight_sum` AS `freight_sum`,`t_order`.`remark` AS `remark`,`t_order`.`pay_status` AS `pay_status`,`t_order`.`pay_type` AS `pay_type`,`t_order`.`pay_sum` AS `pay_sum`,`t_order`.`destination` AS `destination`,`t_order`.`receiver` AS `receiver`,`t_order`.`phone` AS `phone`,`t_order`.`delivery_number` AS `delivery_number`,`t_order`.`delivery_company` AS `delivery_company`,`t_order`.`create_at` AS `create_at`,`t_order`.`status` AS `status` from (`t_order` left join `t_user_order` on((`t_order`.`id` = `t_user_order`.`order_id`))) ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
