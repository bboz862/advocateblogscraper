DROP DATABASE IF EXISTS `advocateblog`;

CREATE DATABASE `advocateblog`;

USE advocateblog;

CREATE TABLE blogmetadata(
  id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY
,	title VARCHAR(100)
, category_id_json VARCHAR(1000)
, theme_id tinyint
, author VARCHAR(10000) CHARACTER SET utf8
, post TEXT CHARACTER SET utf8
, post_date DATE
, tag_id_json VARCHAR(1000) CHARACTER SET utf8
);

LOAD DATA INFILE "/Users/brendan/Projects/advocateblogscraper/blogmetadata.csv"
INTO TABLE blogmetadata
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n'
(title, category_id_json, theme_id, author, post, post_date, tag_id_json);

CREATE TABLE images(id SMALLINT NOT NULL PRIMARY KEY
	, path VARCHAR(1000)
	, caption VARCHAR(10000) CHARACTER SET utf8
);

LOAD DATA INFILE "/Users/brendan/Projects/advocateblogscraper/imageinfo.csv"
INTO TABLE images
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';


CREATE TABLE themes(id SMALLINT NOT NULL PRIMARY KEY
	, name VARCHAR(100));

LOAD DATA INFILE "/Users/brendan/Projects/advocateblogscraper/themes.csv"
INTO TABLE themes
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

CREATE TABLE categories(id SMALLINT NOT NULL PRIMARY KEY
	, name VARCHAR(100));

LOAD DATA INFILE "/Users/brendan/Projects/advocateblogscraper/categories.csv"
INTO TABLE categories
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

CREATE TABLE tags(id SMALLINT NOT NULL PRIMARY KEY
	, name VARCHAR(100));

LOAD DATA INFILE "/Users/brendan/Projects/advocateblogscraper/tags.csv"
INTO TABLE tags
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

