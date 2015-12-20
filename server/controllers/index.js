var models = require('../models');
var bluebird = require('bluebird');



module.exports = {
  messages: {
    get: function (req, res) {
      //call the get method of the model
      //model fetches from the database and returns the message obj.
      //then we send the messages obj as json to the client.
      models.messages.get(function(result) {
        console.log(result);
        res.json(result); //express method
      });
      
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      //take the messages obj provided and add it to database
      models.messages.post(req.body);
      console.log('from controller, post:', req.body);
      res.send('POST request');
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(function(result) {
        console.log("results from ctrl: ", result);
        res.json(result); //express method
      });
    },
    post: function (req, res) {
      models.users.post(req.body, function(result) {
        console.log("results from ctrl: ", result);
        res.json(result); //express method
      });
    }
  }
};


/* messages.get('/', function (req, res) {
  res.send('root');
});

app.messages.post();*/