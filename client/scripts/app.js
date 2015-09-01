var app = {};
//Define init property to store event handlers and main chatterbox logic.
app.init = function() {
  //Button click functions. Chat rooms and friends.
  app.fetch();
  setInterval(app.fetch, 5000);
  $('#roomSelect').on('click', 'p', function(event) {
    window.currentRoom = event.currentTarget.innerText;
    app.fetch();
  });
  $('aside h3').on('click', function(event) {
    window.currentRoom = null;
    app.fetch();
  });
  $('#chats').on('click', '.message-content .username', function(event) {
    app.addFriend(event.currentTarget.innerText);
    app.fetch();
  });
  $('#send .submit').on("click", function(event) {
    app.handleSubmit();
  });

  window.rooms = [];
  window.currentRoom = null;
  window.friends = [];

  //Get username from intial prompt and store it in a global variable
  window.username = window.location.search.slice(10);
  $('h2.user').text('Welcome, ' + window.username);

}

//The server URL we will use for GET and POST requests
app.server = 'https://api.parse.com/1/classes/chatterbox/';

//Retrieving messages via a GET request
app.fetch = function () {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    //data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      //Remove existing contents from message contain app.clearMessages();
      //Clear existing rooms from chatrooms sidebar
      $('aside div').empty();
      //Get array of all message objects
      var messages = data.results;
      //Iterate over all message objects and add to page in 
      //chronological order.
      for (var i = 1; i <= messages.length; i++) {
        var msg = messages[messages.length-i]
        //Wonderful escaping method
        var escapedMsg = $('<div>').text(msg.text).html();
        var escapedUsr = $('<div>').text(msg.username).html();
        var escapedRoom = $('<div>').text(msg.roomname).html();
        if (!_.contains(window.rooms, escapedRoom)) {
          window.rooms.push(escapedRoom);
        };

        //Sets message content to bold if the user name is in the current friends list
        var msgClass = window.friends.indexOf(escapedUsr) !== -1 ? "bold" : "normal";

        if (currentRoom) {
          //If currentRoom is defined, only append messages from that room to the page
          if (currentRoom === escapedRoom) {
            var messageDiv = $('<div class=\'message-content\'></div>');
            messageDiv.html('<span class=\'user\'>' + escapedUsr + '</span><p class="' + msgClass + '"">' + escapedMsg + '</p>');
            $('#chats').prepend(messageDiv);  
          }
        } else {
          //Otherwise append all existing messages to the page
          var messageDiv = $('<div class=\'message-content\'></div>');
          messageDiv.html('<span class=\'username\'>' + escapedUsr + '</span><p class="' + msgClass + '"">' + escapedMsg +'</p>');
          $('#chats').prepend(messageDiv);
        }
      }
      //Append current rooms to the Chatrooms sidebar
      _.each(window.rooms, function(room) {
        $('aside div').append('<p>' + room + '</p>');
      });
      console.log('chatterbox: Messages Retrieved');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve message');
    }
  });
}

//Posting messages via a POST request
app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}

//Make a clear messages function to clear all children from the DOM #chats node
app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  app.send(message);
  // var messageDiv = $('<div class=\'message-content\'></div>');
  // messageDiv.html('<span class=\'username\'>' + message.username + '</span><p class="' + '"">' + message.text +'</p>');
  // $('#chats').prepend(messageDiv);
  app.fetch();
};

app.addRoom = function(room) {
  $('#roomSelect').prepend($('<p>' + room + '</p>'));
};

app.addFriend = function(friend) {
  window.friends.push(friend);
}

app.handleSubmit = function() {
  var message = {};
  var content = $('#message').val();
  message.text = content;
  message.username = window.username;
  app.addMessage(message);
  $('#send .submit').off();
};

//Call init once to start the chatterbox logic
app.init();
    
