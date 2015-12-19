var controllers = require('./controllers');
var router = require('express').Router();

for (var route in controllers) {
//  console.log("route", "/"+route);
  router.route("/" + route)
  //router.route("/messages")
    .get(controllers[route].get)
  //  .get(controllers.messages.get)
    .post(controllers[route].post);
}

module.exports = router;

