/******************************************/
/*   DatabaseName = llm   */
/*   TableName = stock_factor   */
/******************************************/
CREATE TABLE `stock_factor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(16) NOT NULL COMMENT '所属用户ID',
  `name` varchar(64) NOT NULL,
  `description` varchar(2056) DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `fn` text NOT NULL COMMENT '处理逻辑',
  `echarts_show_type` varchar(24) NOT NULL COMMENT '在图表中的显示类型',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci
;