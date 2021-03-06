var express   = require('express'),
    app       = express.createServer(),
    nowjs     = require('now'),
    everyone  = nowjs.initialize(app);



/////////////
//         //
// Express //
//         //
/////////////

app.configure(function () {

  app.use(express.static(__dirname + '/public'));

});

app.get('/update', function (req, res) {

  console.log('Updating all users.');
  everyone.now.update();
  res.end(null);

});

app.listen(80);

console.log('Running express');



/////////
//     //
// Now //
//     //
/////////

// A key value store of userIds to names
everyone.now.users = {};

// A key value store of userIds to nowJS objects
var clients = {};

// New clients call this when they connect so we can add them to our store
everyone.now.register = function (name) {

  var clientId = this.user.clientId;

  console.log("Registering: " + name + " (clientId: " + clientId + ")");

  everyone.now.users[clientId] = name;
  clients[clientId] = this;

  // This will fail if no clients are connected yet
  try {
    everyone.now.addUser(name, clientId);
  } catch (e) {}

};

// When a client disconnects, remove them from our stores
everyone.disconnected(function () {

  var clientId = this.user.clientId;

  if (clients[clientId]) {
    everyone.now.users[clientId] = null;
    clients[clientId] = null;
    try {
      everyone.now.removeUser(clientId);
    } catch (e) {}
  }

});

// Send a user to a web page
everyone.now.sendGoTo = function (userId, url) {

  var client = clients[userId];
  if (client) {

    try {
      client.now.receiveGoTo(url);
    } catch (e) {}

  }

};

console.log('Running now.js');
