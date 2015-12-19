CREATE DATABASE chat;

USE chat;

CREATE TABLE Users (
  userId int NOT NULL AUTO_INCREMENT,
  username varchar(40),
  PRIMARY KEY (userId)
);

CREATE TABLE Messages (
  /* Describe your table here.*/
  messageId int NOT NULL AUTO_INCREMENT,
  userId int NOT NULL,
  message varchar(150),
  timestamp timestamp,
  roomname varchar(30),
  PRIMARY KEY (messageId),
  FOREIGN KEY (userId) REFERENCES Users(userId)
);

/* Create other tables and define schemas for them here! */


-- SELECT rooms.roomId, messages.messageId 
--   FROM messages JOIN rooms ON rooms.roomId=messages.messageId


/*  Execute this file from the command line by typing:
      //must run from directory and not in SQL
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

