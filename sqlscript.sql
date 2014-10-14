DROP DATABASE IF EXISTS `advocateblog`;

CREATE DATABASE `advocateblog`;

USE advocateblog;

CREATE TABLE blogmetadata(title VARCHAR(100)
, categories VARCHAR(1000)
, theme_id tinyint
, author VARCHAR(100000) CHARACTER SET utf8
, post BLOB, post_date DATE);

LOAD DATA INFILE "/Users/brendan/Projects/advocateblogscraper/blogmetadata.csv"
INTO TABLE blogmetadata
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

CREATE TABLE images(id SMALLINT, url VARCHAR(1000));

LOAD DATA INFILE "/Users/brendan/Projects/advocateblogscraper/imageinfo.csv"
INTO TABLE images
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';


CREATE TABLE themes(id SMALLINT, theme VARCHAR(100));

LOAD DATA INFILE "/Users/brendan/Projects/advocateblogscraper/themes.csv"
INTO TABLE themes
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

CREATE TABLE categories(id SMALLINT, category VARCHAR(100));

LOAD DATA INFILE "/Users/brendan/Projects/advocateblogscraper/categories.csv"
INTO TABLE categories
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\r\n';

