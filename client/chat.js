
socket.on('chatMsg', function(msg) {
    if (msg.user === "Server"){
        $("#chatlog").append("<p class='sysMsg'><i><b>" + msg.user + ":</b> " + msg.msg + "</i></p>");
    } else {
        $("#chatlog").append("<p><b>" + msg.user + ":</b><br />" + msg.msg + "</p>");
    }
    updateScroll();
});

socket.on('roomData', function(msg) {
    if (typeof roomID === 'undefined') {
        $("#room-id").append(msg);
        $("#room-username").append("<i>" + username + "</i>");
        roomID = msg;
    }
});

function updateScroll() {
    $("#chatlog").scrollTop($("#chatlog").get(0).scrollHeight);
}
