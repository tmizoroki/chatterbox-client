//Set up message operations and helper functions once the document has loaded
$(document).ready(function() {
  //Get username from intial prompt and store it in a global variable
  var username = window.location.search.slice(10);
  console.log(typeof username);
  $('h2.username').text('Welcome, ' + username);

  //Create message object and add click event/handler when
  //user posts a new message
  var message = {};
  $('#post-content').on("click", function(event) {
    //event.preventDefault();
    var content = $('#content').val();
    message.text = content;
    message.username = username;
    console.log(message);
    postMessage(message);
    getMessages();
  });
  
  var rooms = [];

  //Display Messages retrieved from parse server
  //Make a GET request.  Runs every five seconds to
  //display the most recent 100 messages.
  var getMessages = function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox/',
      type: 'GET',
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        //Remove existing contents from message container
        $('#message-container').empty();
        //Clear existing rooms from chatrooms sidebar
        $('aside div').empty();
        
        console.log(data);
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
          if (!_.contains(rooms, escapedRoom)) {
            rooms.push(escapedRoom);
          };

          var messageDiv = $('<div class=\'message-content\'></div>');
          messageDiv.html('<span class=\'user\'>' + escapedUsr + '</span><p>' + escapedMsg + '</p>');
          $('#message-container').prepend(messageDiv);
          
        }
        //Append current rooms to the Chatrooms sidebar
        _.each(rooms, function(room) {
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

//Make a POST method to post messages to chatterbox.  We should probably refresh the 
//feed everytime we post something new.  
  var postMessage = function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
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
  
  getMessages();
  setInterval(getMessages, 5000);

//Rooms and Solializing


});