
socket.on('chatMsg', function(msg) {
    $("#chatlog").append("<p><b>" + msg.user + ":</b> " + msg.msg + "</p>");
});

socket.on('roomData', function(msg) {
    if (typeof roomID === 'undefined') {
        $("#room-id").append(msg);
        roomID = msg;
    }
});
