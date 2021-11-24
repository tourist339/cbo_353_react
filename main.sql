CREATE DATABASE IF NOT EXISTS cbo_addiction;
USE cbo_addiction;
CREATE TABLE IF NOT EXISTS login_credentials(
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS `customer` (
`id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
`firstname` VARCHAR(255) NOT NULL,
`lastname` VARCHAR(255) NOT NULL,
`login_id` INT NOT NULL UNIQUE,
`addiction_type` INT NOT NULL,
`phone_num` VARCHAR(5000) ,
`report_ids` VARCHAR(5000) ,
`staff_id` INT
);

CREATE TABLE IF NOT EXISTS `report` (
`id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
`customer_id` INT NOT NULL ,
`data` VARCHAR(5000) NOT NULL
);

CREATE TABLE IF NOT EXISTS `staff` (
`id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
`firstname` VARCHAR(255) NOT NULL,
`lastname` VARCHAR(255) NOT NULL,
`login_id` INT NOT NULL UNIQUE,
`addiction_speciality` INT NULL,
`customer_ids` VARCHAR(5000));

CREATE TABLE IF NOT EXISTS addictions(
	`id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL  
);
INSERT INTO `cbo_addiction`.`login_credentials`
(`id`,
`username`,
`password`,
`type`)
VALUES
(1,
"kak110",
"$2b$04$V9QhMGKeo9eDpZMKpJR86O3aFkmwdAG8fNxKM9KtmZVCGCTANcHnW",
"admin");
INSERT INTO `cbo_addiction`.`addictions`
(`id`,
`name`)
VALUES
(101,
"Alcohol Addiction"),
(111,
"Opium Addiction"),
(121,
"Fentanyl Addiction"),
(131, 
"Cocaine Addiction");


