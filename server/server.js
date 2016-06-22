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

    // Chat system!
    socket.on('chatMsg', function(msg){
        socket.broadcast.to(roomID).emit('chatMsg', msg);
    });

    // Notify disconnect
    socket.on('disconnect', function(msg){
        console.log('USER[' + socket.conn.remoteAddress + '] ACTION: LEAVE=>ROOM[' + roomID + "] REASON: " + msg.toUpperCase());
    });

    // Outputs debug information sent from client
    socket.on('debug', function(msg) {
        console.log("DEBUG: " + msg);
    });

    // Adds the user to a room
    socket.on('ready', function(msg) {
        if (typeof msg.id !== 'undefined') {
            // checks if the room is available
            if (typeof io.sockets.adapter.rooms[msg.id] !== 'undefined' && io.sockets.adapter.rooms[msg.id].length == 2) {
                // Tell that user room is full
            } else {
                roomID = msg.id;
                socket.join(roomID);
                if (typeof io.sockets.adapter.rooms[roomID].diff === 'undefined')
                    io.sockets.adapter.rooms[roomID].diff = msg.diff;
            }
        } else {
            // Go to the next room only if the current room doesn't exist and (the room is full or if the difficulty aren't equal)
            // I'm slow today. I had to write out the logic as a comment before I was able to understand it gg
            while (typeof io.sockets.adapter.rooms[roomID.toString()] !== 'undefined' && (io.sockets.adapter.rooms[roomID.toString()].length >= 2 || io.sockets.adapter.rooms[roomID.toString()].diff !== msg.diff))
                roomID++;
            roomID = roomID.toString(); // Changes our variable to a String, so we don't need to convert it every time
            socket.join(roomID);
            io.sockets.adapter.rooms[roomID].diff = msg.diff;
        }

        io.sockets.in(roomID.toString()).emit('roomData', roomID);

        console.log('USER[' + socket.conn.remoteAddress + '] ACTION: JOIN=>ROOM[' + roomID + ']');
        console.log('DEBUG: username: ' + msg.username + ' id: ' + msg.id + ' diff: ' + msg.diff);

        // Data announcement
        if (io.sockets.adapter.rooms[roomID].length == 2) {
            var data = { };
            data.seed = Math.random().toString();
            data.diff = msg.diff;
            data.room = roomID;
            io.sockets.in(roomID.toString()).emit('startData', data);
            console.log("SERVER ACTION: ANNOUNCE DATA TO ROOM[" + roomID + "]");
            console.log("DEBUG: ROOM: " + JSON.stringify(io.sockets.adapter.rooms[roomID]));
        }


    });

});

http.listen(80, function(){
    console.log('listening on *:80');
});
