var socket = io();

var randomSeed;

socket.on('seed', function(msg) {
    console.log("recieved seed: " + msg);
    randomSeed = msg;

    generateMaze();
    displayMaze();
    drawUser();
    attachKeyListener();
    socket.emit('seedAck', 'client has received seed ' + msg);
});
