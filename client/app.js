var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox' //used for all requests
app.friends = {};
app.intervalID;
app.currentRoom = "Lobby";
var submitClicked = false;
app.stop = function () { clearInterval(app.intervalID) };
app.init = function() {

  // //app.clearMessages();


};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent. Data: ', data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message. Error: ', data);
    }
  });
};

app.fetch = function(callback, queryString) {
  queryString = queryString || '';
  $.ajax({
    url: app.server + queryString,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      if(callback) {
        callback(data);
      }
      console.log('chatterbox: Message received. Data: ', data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to receive message. Error: ', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.addMessage = function(message) {
  var $chats = $('#chats');
  var newChat = app.escapeCharacters(String(message.text));
  if(app.friends[message.username]) {
    $chats.append('<div class="bold"><a class="username" href="#">' + app.escapeCharacters(message.username) + '</a>' + newChat + '</div>');    
  } else {
    $chats.append('<div><a class="username" href="#">' + app.escapeCharacters(message.username) + '</a>: ' + newChat + '</div>');    
  }
};

app.addRoom = function(roomName) {
  //roomName = app.escapeCharacters($('#roomName').val() || roomName); 
  $('#roomSelect').append($('<option>'+ app.escapeCharacters(roomName) +'</option>'))
};

app.addFriend = function (friend) {
  app.friends[friend] = true;
  app.getMessages();
};

app.escapeCharacters = function(text) {
  //prevent some XSS attack
  // THIS ATTACK WORKED --> text: "<script>alert('close me');</script>"
  if(typeof text === "string") {
    text = text.replace(/[<>']+/g, '');
  }
  return text;
};

app.handleSubmit = function (messageText) {
  var roomName = app.escapeCharacters($('#roomName').val() || app.currentRoom); 
  var message = {
    username: app.escapeCharacters(window.location.search.slice(10)),
    text: app.escapeCharacters(messageText),
    roomname: app.escapeCharacters(roomName)
  };
  console.log(messageText);
  app.send(message);
};

app.getMessages = function(roomName) {
  app.fetch(function(data) {
    app.clearMessages();
    data.results.forEach(app.addMessage);
  }, '?order=-createdAt&where={"roomname":"'+ app.currentRoom +'"}');
}

app.refreshRoomNames = function() { //maybe rename to handleSelection ??
  var rooms;

  app.fetch(function(data) {
    rooms = data.results;
    rooms = rooms.map(function(message) {
      return message.roomname;
    });

    rooms = _.uniq(rooms);
    console.log(rooms);
    var $roomSelect = $('#roomSelect');
    $roomSelect.find('option').remove();
    $roomSelect.append($('<option>[Create New Room...]</option>'));

    rooms.forEach(function(roomName) {
      $roomSelect.append($('<option>' + roomName + '</option>'));
    })

    //$roomSelect.val(app.currentRoom);

    var newRoomValue = $('#roomName').val()
    if(newRoomValue && submitClicked) {
      //$('#roomSelect').find('option[value=' + newRoomValue + ']').attr("selected",true);
      app.currentRoom = newRoomValue
      $('#roomName').val('');
      $('#roomName').addClass("hidden");
      submitClicked = false;
    }

    $roomSelect.val(app.currentRoom);
  }, '?order=-createdAt');
}


// create app.friends = {}
// addFriend function should take the friend string passed in and add it to object
// inside addMessage function, check if username exists as key on friends object
  // if exists, bold the whole message (either by adding <b> tag, or use css/class)

$(document).ready(function(){
  app.init();

  $('#main').on('click', '.username', function(e) {
    app.addFriend(e.target.innerHTML);
  });

  $('#send').on('submit', function(e){
    submitClicked = true;
    app.handleSubmit( $('#message').val() );
    e.preventDefault();
  });

  $('#roomSelect').change(function() {
    console.log($('option:selected', this).text());
    var selectedRoom = $('option:selected', this).text();
    if(selectedRoom === "[Create New Room...]") {
      $('#roomName').removeClass("hidden");

      //keeps changing room if the line below is removed
      app.currentRoom = selectedRoom;
    } else {
       $('#roomName').addClass("hidden");
      app.currentRoom = selectedRoom;
    }

    app.getMessages();
  });

  app.getMessages();
  app.refreshRoomNames();
  app.intervalID = setInterval(function() {
    app.getMessages();
    app.refreshRoomNames();
  }, 5000);

});