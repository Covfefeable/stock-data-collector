/******************************************/
/*   DatabaseName = llm   */
/*   TableName = stock_index   */
/******************************************/
CREATE TABLE `stock_index` (
  `ticker` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '指数代码',
  `date` date NOT NULL COMMENT '日期',
  `open` decimal(15,4) NOT NULL COMMENT '开盘价',
  `high` decimal(15,4) NOT NULL COMMENT '最高价',
  `low` decimal(15,4) NOT NULL COMMENT '最低价',
  `close` decimal(15,4) NOT NULL COMMENT '收盘价',
  `volume` bigint(20) NOT NULL COMMENT '成交量',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(15) NOT NULL COMMENT '类型',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_date_ticker_type` (`date`,`ticker`,`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=38620 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci AVG_ROW_LENGTH=195
;