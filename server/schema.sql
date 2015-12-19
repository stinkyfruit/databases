CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
  /* Describe your table here.*/
  messageId int NOT NULL AUTO_INCREMENT,
  userId int,
  text varchar(150),
  timestamp timestamp,
  roomname varchar(40),
  PRIMARY KEY (messageId)
);

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
      //must run from directory and not in SQL
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

