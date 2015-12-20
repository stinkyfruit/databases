var db = require('../db');



module.exports = {
  messages: {
    get: function (callback) {
      //use mysql commands to select all fields that the user is requesting for a message object
      var queryString = 'SELECT * from Messages LEFT OUTER JOIN Users ON (Messages.userId = Users.userId)';
      db.connection.query(queryString, function(err, result) {
        callback(result);
      });
      
    }, // a function which produces all the messages
    post: function (params, callback) { // how to construct a query
      //a function which can be used to insert a message into the database
      //adding given message object to messages table
      var queryString = 'INSERT into messages (userId, message, timestamp, roomname)'+
                        ' values ((SELECT userId FROM Users where username = ? limit 1), ?, ?, ?)';
      // INSERT into messages (messageId, userId, message, timestamp, roomId)
      //                      values (req.messageId, req.userId, req.message, req.timestamp, req.roomId);
      db.connection.query(queryString, params, function(err, result) {
        console.log("err from model: ", err);
        callback(result);
      });
    }
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      var queryString = 'SELECT * from Users';
      db.connection.query(queryString, function(err, result) {
        console.log("result from model: ", result);
        callback(result);
      });
    },
    post: function (params, callback) {
      var queryString = 'INSERT INTO Users (username) values(?)';
      db.connection.query(queryString, params, function(err, result) {
        console.log("err from model: ", err);
        console.log("result from model: ", result);
        callback(result);
      });
    }
  }
};

// SELECT * FROM Messages
//   JOIN Users ON Users.UserId = Messages.UserId;

// SELECT * FROM Users WHERE id IN 
//    (SELECT userId FROM Users)