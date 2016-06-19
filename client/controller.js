var socket = io();

var randomSeed;

// Should be called after everything else is loaded
socket.on('seed', function(msg) {
    console.log("recieved seed: " + msg);
    randomSeed = msg;

    clearMaze();

    generateMaze();
    displayMaze();
    drawUser();
    attachKeyListener();
    socket.emit('seedAck', 'client has received seed ' + msg);
});

socket.on('connect', function() {
    socket.emit('ready', 'client is ready!');
});
