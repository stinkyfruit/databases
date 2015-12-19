var models = require('../models');
var bluebird = require('bluebird');



module.exports = {
  messages: {
    // get: function (req, res) {
    //   res.send('GET request');
    // }, // a function which handles a get request for all messages
    // post: function (req, res) {
    //   res.send('POST request');
    // } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {}
  }
};


app.messages.get('/', function (req, res) {
  res.send('root');
});

app.messages.post();