var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http, {'pingTimeout': 10000});

// Sends over our resources
app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res){
    console.log("SERVER LOG: REQUEST RECIEVED");
    res.sendFile(path.resolve(__dirname + '/../client/client.html'));
});

io.on('connection', function(socket){
    var roomID = 0;

    // Opponent movement listener
    socket.on('userMovement', function(msg){
        // TODO: implement movement verification
        socket.to(roomID).emit('userMovement', msg);
    });

    // Chat system!
    socket.on('chatMsg', function(msg){
        io.in(roomID).emit('chatMsg', msg);
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
    socket.on('ready', function(msg, callback) {
        // If the room is full, don't join the room
        join: {
            if (typeof msg.id !== 'undefined') {
                if (typeof io.sockets.adapter.rooms[msg.id] !== 'undefined'){
                    if (io.sockets.adapter.rooms[msg.id].length == 2) {
                        callback("full");
                        break join;
                    }
                    // If we need to reject joining to the room for any other reason, add it here
                } else {
                    roomID = msg.id;
                    socket.join(roomID);
                    if (typeof io.sockets.adapter.rooms[roomID].diff === 'undefined')
                        io.sockets.adapter.rooms[roomID].diff = msg.diff;
                }
            } else {
                while (typeof io.sockets.adapter.rooms[roomID.toString()] !== 'undefined' && (io.sockets.adapter.rooms[roomID.toString()].length >= 2 || io.sockets.adapter.rooms[roomID.toString()].diff !== msg.diff))
                    roomID++;
                roomID = roomID.toString(); // Changes our variable to a String, so we don't need to convert it to a string every time
                socket.join(roomID);
                io.sockets.adapter.rooms[roomID].diff = msg.diff;
            }

            callback("ok");

            io.in(roomID.toString()).emit('roomData', roomID);

            console.log('USER[' + socket.conn.remoteAddress + '] ACTION: JOIN=>ROOM[' + roomID + ']');
            console.log('DEBUG: username: ' + msg.username + ' id: ' + msg.id + ' diff: ' + msg.diff);

            // Data announcement
            if (io.sockets.adapter.rooms[roomID].length == 2) {
                var data = { };
                data.seed = Math.random().toString();
                data.diff = msg.diff;
                data.room = roomID;
                io.in(roomID.toString()).emit('startData', data);
                console.log("SERVER ACTION: ANNOUNCE DATA TO ROOM[" + roomID + "]");
                console.log("DEBUG: ROOM: " + JSON.stringify(io.sockets.adapter.rooms[roomID]));
            }
        }
    });

    socket.on('getNewMap', function(msg) {
        io.in(roomID.toString()).emit('newMazeData', {seed: Math.random().toString(), username: msg});
    });
});

http.listen(80, function(){
    console.log('listening on *:80');
});
