var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res){
    console.log("new request!");
    res.sendFile(path.resolve(__dirname + '/../client/client.html'));
});

io.on('connection', function(socket){
    // Find and join an unfilled room
    var roomID = 0;
    while (typeof io.sockets.adapter.rooms[roomID.toString()] !== 'undefined' && io.sockets.adapter.rooms[roomID.toString()].length >= 2)
        roomID++;
    socket.join(roomID.toString());
    console.log('A user from ' + socket.conn.remoteAddress + ' has connected to room ' + roomID);

    socket.on('seedAck', function(msg) {
        console.log(msg);
    })

    // Opponent movement listener
    socket.on('userMovement', function(msg){
        /*
        // I'm a sneaky person. Validates that only one block was moved at time, or otherwise don't send the data out. This has an unintented but desired effect of the cheater's viewpoint to update sucessfully, but not for the other user.
        if (Math.abs((msg.x - msg.x1) + (msg.y - msg.y1)) === 1) {
        }
        */
        socket.broadcast.to(roomID).emit('userMovement', msg);
    });

    // Notify disconnect
    socket.on('disconnect', function(){
        console.log('A user from ' + socket.conn.remoteAddress + ' has disconnected and left room ' + roomID);
    });

    // Outputs debug information sent from client
    socket.on('debug', function(msg) {
        console.log(msg);
    });

    // the 'ready' message is sent from the client when it loads.
    socket.on('ready', function(msg) {
        console.log(msg);
        // Seed announcement
        if (io.sockets.adapter.rooms[roomID.toString()].length == 2) {
            var seed = Math.random().toString();
            io.sockets.in(roomID.toString()).emit('seed', seed);
            console.log("announcing seed " + seed + " to room " + roomID);
        }
    });

});

http.listen(80, function(){
    console.log('listening on *:80');
});
