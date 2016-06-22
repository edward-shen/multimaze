// This file hosts the code that is appliciable to the function of the app itself, rather than any specific module

var socket = io({'sync disconnect on unload': true });

var randomSeed, username, roomID;

// Should be called after everything else is loaded
socket.on('startData', function(msg) {
    randomSeed = msg.seed;

    switch (msg.diff) {
        case "easy":
            ySize = 10;
            xSize = 10;
            break;
        case "medium":
            ySize = 15;
            xSize = 20;
            break;
        case "hard":
            ySize = 25;
            xSize = 35;
            break;
        default:
            console.log("ERROR: UNKNOWN DIFFICULTY \"" + msg.diff + "\"");
    }

    clearMaze();

    generateMaze();
    displayMaze();
    drawUser();
    attachKeyListener();
    socket.emit('debug', 'CLIENT[?] ACTION: ACKNOWLEDGE=>DATA(' + JSON.stringify(msg) + ')');
});
