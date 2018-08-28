CREATE TABLE `floors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;



CREATE TABLE `employees_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `ip` varchar(25) NOT NULL DEFAULT '',
  `x` double NOT NULL,
  `y` double NOT NULL,
  `room_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `emp_unique` (`employee_id`),
  KEY `fk_room` (`room_id`),
  CONSTRAINT `fk_room` FOREIGN KEY (`room_id`) REFERENCES `floors` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;


CREATE TABLE `rooms` (
`id`  int NOT NULL AUTO_INCREMENT ,
`name`  varchar(100) NOT NULL ,
`x1`  int NOT NULL ,
`y1`  int NOT NULL ,
`x2`  int NOT NULL ,
`y2`  int NOT NULL ,
`floor_id` int(11) NOT NULL,
PRIMARY KEY (`id`));

