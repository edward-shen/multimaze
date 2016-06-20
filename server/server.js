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

    // Opponent movement listener
    socket.on('userMovement', function(msg){
        // TODO: implement movement verification
        socket.broadcast.to(roomID).emit('userMovement', msg);
    });

    // Notify disconnect
    socket.on('disconnect', function(){
        console.log('A user from ' + socket.conn.remoteAddress + ' has disconnected and left room ' + roomID);
    });

    // Outputs debug information sent from client
    socket.on('debug', function(msg) {
        console.log("DEBUG: " + msg);
    });

    // The 'ready' message is sent when the user clicks play
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
