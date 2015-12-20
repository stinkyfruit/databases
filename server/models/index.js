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
    post: function (req) { // how to construct a query
    //a function which can be used to insert a message into the database
    //adding given message object to messages table
      //var valueToInsert = req.messageId, req.userId, req.message, req.timestamp, req.roomId
    // INSERT into messages (messageId, userId, message, timestamp, roomId)
    //                      values (req.messageId, req.userId, req.message, req.timestamp, req.roomId);
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
    post: function () {}
  }
};

// SELECT * FROM Messages
//   JOIN Users ON Users.UserId = Messages.UserId;

// SELECT * FROM Users WHERE id IN 
//    (SELECT userId FROM Users)