
socket.on('chatMsg', function(msg) {
    $("#chatlog").append("<p><b>" + msg.user + ":</b> " + msg.msg + "</p>");
    updateScroll();
});

socket.on('roomData', function(msg) {
    if (typeof roomID === 'undefined') {
        $("#room-id").append(msg);
        roomID = msg;
    }
});

function updateScroll() {
    $("#chatlog").scrollTop($("#chatlog").get(0).scrollHeight);
}
