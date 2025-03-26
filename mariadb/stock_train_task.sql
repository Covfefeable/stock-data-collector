/******************************************/
/*   DatabaseName = llm   */
/*   TableName = stock_train_task   */
/******************************************/
CREATE TABLE `stock_train_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `user_id` varchar(16) NOT NULL COMMENT '所属用户ID',
  `name` varchar(64) NOT NULL COMMENT '任务名称',
  `description` varchar(256) DEFAULT NULL COMMENT '任务描述',
  `ticker` varchar(24) NOT NULL COMMENT '代码',
  `type` varchar(24) NOT NULL COMMENT '类型',
  `start_date` date NOT NULL COMMENT '开始时间',
  `end_date` date NOT NULL COMMENT '结束时间',
  `factors` varchar(128) DEFAULT NULL COMMENT '额外因子',
  `primary_ticker` varchar(24) NOT NULL COMMENT '主代码',
  `primary_key` varchar(24) NOT NULL COMMENT '主字段',
  `reserved_keys` varchar(1024) NOT NULL COMMENT '保留字段',
  `model` varchar(64) NOT NULL COMMENT '模型',
  `step_num` int(11) NOT NULL COMMENT '步长',
  `input_keys` varchar(1024) NOT NULL COMMENT '输入特征',
  `output_key` varchar(64) NOT NULL COMMENT '输出特征',
  `output_type` varchar(64) NOT NULL COMMENT '输出形式',
  `weight_bin_file` mediumblob DEFAULT NULL COMMENT '权重文件',
  `model_json_file` mediumblob DEFAULT NULL COMMENT '模型json',
  `create_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `epochs` int(11) NOT NULL DEFAULT 50 COMMENT '训练轮数',
  `batch_size` int(11) NOT NULL DEFAULT 100 COMMENT '批次大小',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
;
