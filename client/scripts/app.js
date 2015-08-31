// YOUR CODE HERE:


//Display Messages retrieved from parse server
  //Make a GET request
  setInterval(function() {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    //data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      //Remove existing contents from message container
      $('#message-container').empty();
      console.log(data);
      //Get array of all message objects
      var messages = data.results;
      //Iterate over all message objects and add to page in 
      //chronological order.
      for (var i = 1; i <= messages.length; i++) {
        var msg = messages[messages.length-i]
        var escaped = $('<div>').text(msg.text).html();
        $('#message-container').prepend('<p>'+ escaped + '</p>');
        
      }
      console.log('chatterbox: Messages Retrieved');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
})
}, 5000);;


//Setup way to refresh displayed Messages

//Use proper escaping on user input

//Allow users to select a username and send Messages

//Example message object
// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };

//Example AJAX request
// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'https://api.parse.com/1/classes/chatterbox',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message');
//   }
// });




//Rooms and Solializing