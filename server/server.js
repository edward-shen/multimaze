var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http, {'pingTimeout': 10000});

app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res){
    console.log("SERVER LOG: REQUEST RECIEVED");
    res.sendFile(path.resolve(__dirname + '/../client/client.html'));
});

io.on('connection', function(socket){
    // Find and join an unfilled room
    var roomID = 0;

    // Opponent movement listener
    socket.on('userMovement', function(msg){
        // TODO: implement movement verification
        socket.broadcast.to(roomID).emit('userMovement', msg);
    });

    // Notify disconnect
    socket.on('disconnect', function(msg){
        console.log('USER[' + socket.conn.remoteAddress + '] ACTION: LEAVE=>ROOM[' + roomID + "] REASON: " + msg);
    });

    // Outputs debug information sent from client
    socket.on('debug', function(msg) {
        console.log("DEBUG: " + msg);
    });

    // Adds the user to a lobby
    socket.on('ready', function(msg) {
        if (typeof msg.id !== 'undefined') {
            // checks if the room is available
            if (typeof io.sockets.adapter.rooms[msg.id] !== 'undefined' && io.sockets.adapter.rooms[msg.id].length == 2) {
                // Tell that user room is full
            } else {
                roomID = msg.id;
                socket.join(roomID);
            }
        } else {
            while (typeof io.sockets.adapter.rooms[roomID.toString()] !== 'undefined' && io.sockets.adapter.rooms[roomID.toString()].length >= 2)
                roomID++;
            socket.join(roomID.toString());
        }

        console.log('USER[' + socket.conn.remoteAddress + '] ACTION: JOIN=>ROOM[' + roomID + ']');
        console.log('DEBUG: username: ' + msg.username + ' id: ' + msg.id + ' diff: ' + msg.diff);

        // Seed announcement
        if (io.sockets.adapter.rooms[(typeof roomID === 'string') ? roomID : roomID.toString()].length == 2) {
            var seed = Math.random().toString();
            io.sockets.in(roomID.toString()).emit('seed', seed);
            console.log("SERVER ACTION: ANNOUNCE SEED=>(" + seed + ") TO ROOM[" + roomID + "]");
        }
    });

});

http.listen(80, function(){
    console.log('listening on *:80');
});
