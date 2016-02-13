var app;
$(function() {
  app = {
//TODO: The current 'addFriend' function just adds the class 'friend'
//to all messages sent by the user
    // server: 'https://127.0.0.1:3000/classes',
    server: 'http://127.0.0.1:3000/classes/messages',
    username: 'anonymous',
    roomname: 'lobby',
    lastMessageId: 0,
    friends: {},

    init: function() {
      // Get username
      app.username = window.location.search.substr(10);

      // Cache jQuery selectors
      app.$main = $('#main');
      app.$message = $('#message');
      app.$chats = $('#chats');
      app.$roomSelect = $('#roomSelect');
      app.$send = $('#send');

      // Add listeners
      app.$main.on('click', '.username', app.addFriend);
      app.$send.on('submit', app.handleSubmit);
      app.$roomSelect.on('change', app.saveRoom);

      // Fetch previous messages
      app.startSpinner();
      app.fetch(false);

      // Poll for new messages
      //setInterval(app.fetch, 3000);
    },
    send: function(data) {
      app.startSpinner();
      // Clear messages input
      app.$message.val('');

      // POST the message to the server
      $.ajax({
        url: app.server,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
          // Trigger a fetch to update the messages, pass true to animate
          app.fetch();
        },
        error: function (data) {
          console.error('chatterbox: Failed to send message');
        }
      });
    },
    fetch: function(animate) {
      $.ajax({
        url: app.server,
        type: 'GET',
        contentType: 'application/json',
        // data: { order: '-createdAt'},
        success: function(data) {
          console.log('chatterbox: Messages fetched');

          // Don't bother if we have nothing to work with
          if (!data.results || !data.results.length) { return; }

          // Get the last message
          var mostRecentMessage = data.results[data.results.length-1];
          var displayedRoom = $('.chat span').first().data('roomname');
          app.stopSpinner();
          // Only bother updating the DOM if we have a new message
          if (mostRecentMessage.objectId !== app.lastMessageId || app.roomname !== displayedRoom) {
            // Update the UI with the fetched rooms
            app.populateRooms(data.results);

            // Update the UI with the fetched messages
            app.populateMessages(data.results, animate);

            // Store the ID of the most recent message
            app.lastMessageId = mostRecentMessage.objectId;
          }
        },
        error: function(data) {
          console.error('chatterbox: Failed to fetch messages');
        }
      });
    },
    clearMessages: function() {
      app.$chats.html('');
    },
    populateMessages: function(results, animate) {
      // Clear existing messages

      app.clearMessages();
      app.stopSpinner();
      if (Array.isArray(results)) {
        // Add all fetched messages
        results.forEach(app.addMessage);
      }

      // Make it scroll to the bottom
      var scrollTop = app.$chats.prop('scrollHeight');
      if (animate) {
        app.$chats.animate({
          scrollTop: scrollTop
        });
      }
      else {
        app.$chats.scrollTop(scrollTop);
      }
    },
    populateRooms: function(results) {
      app.$roomSelect.html('<option value="__newRoom">New room...</option><option value="" selected>Lobby</option></select>');

      if (results) {
        var rooms = {};
        results.forEach(function(data) {
          var roomname = data.roomname;
          if (roomname && !rooms[roomname]) {
            // Add the room to the select menu
            app.addRoom(roomname);

            // Store that we've added this room already
            rooms[roomname] = true;
          }
        });
      }

      // Select the menu option
      app.$roomSelect.val(app.roomname);
    },
    addRoom: function(roomname) {
      // Prevent XSS by escaping with DOM methods
      var $option = $('<option/>').val(roomname).text(roomname);

      // Add to select
      app.$roomSelect.append($option);
    },
    addMessage: function(data) {
      if (!data.roomname)
        data.roomname = 'lobby';

      // Only add messages that are in our current room
      if (data.roomname === app.roomname) {
        // Create a div to hold the chats
        var $chat = $('<div class="chat"/>');

        // Add in the message data using DOM methods to avoid XSS
        // Store the username in the element's data
        var $username = $('<span class="username"/>');
        $username.text(data.username+': ').attr('data-username', data.username).attr('data-roomname',data.roomname).appendTo($chat);

        // Add the friend class
        if (app.friends[data.username] === true)
          $username.addClass('friend');

        var $message = $('<br><span/>');
        $message.text(data.text).appendTo($chat);

        // Add the message to the UI
        app.$chats.append($chat);
      }
    },
    addFriend: function(evt) {
      var username = $(evt.currentTarget).attr('data-username');

      if (username !== undefined) {
        console.log('chatterbox: Adding %s as a friend', username);

        // Store as a friend
        app.friends[username] = true;

        // Bold all previous messages
        // Escape the username in case it contains a quote
        var selector = '[data-username="'+username.replace(/"/g, '\\\"')+'"]';
        var $usernames = $(selector).addClass('friend');
      }
    },
    saveRoom: function(evt) {

      var selectIndex = app.$roomSelect.prop('selectedIndex');
      // New room is always the first option
      if (selectIndex === 0) {
        var roomname = prompt('Enter room name');
        if (roomname) {
          // Set as the current room
          app.roomname = roomname;

          // Add the room to the menu
          app.addRoom(roomname);

          // Select the menu option
          app.$roomSelect.val(roomname);

          // Fetch messages again
          app.fetch();
        }
      }
      else {
        app.startSpinner();
        // Store as undefined for empty names
        app.roomname = app.$roomSelect.val();

        // Fetch messages again
        app.fetch();
      }
    },
    handleSubmit: function(evt) {
      var message = {
        username: app.username,
        text: app.$message.val(),
        roomname: app.roomname || 'lobby'
      };

      app.send(message);

      // Stop the form from submitting
      evt.preventDefault();
    },
    startSpinner: function(){
      $('.spinner img').show();
      $('form input[type=submit]').attr('disabled', "true");
    },

    stopSpinner: function(){
      $('.spinner img').fadeOut('fast');
      $('form input[type=submit]').attr('disabled', null);
    }
  };
}());

/*var app = {};
app.server = 'http://127.0.0.1:3000/classes' //used for all requests
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

});*/