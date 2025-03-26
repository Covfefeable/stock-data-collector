/******************************************/
/*   DatabaseName = llm   */
/*   TableName = user   */
/******************************************/
CREATE TABLE `user` (
  `user_id` varchar(32) NOT NULL,
  `user_name` varchar(32) NOT NULL,
  `user_password` varchar(512) NOT NULL,
  `user_last_login` datetime DEFAULT NULL,
  `user_token` varchar(16) DEFAULT NULL,
  `user_role` varchar(16) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci
;
