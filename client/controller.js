// This file hosts the code that is appliciable to the function of the app itself, rather than a specific module

var socket = io({'sync disconnect on unload': true });

var randomSeed;

// Should be called after everything else is loaded
socket.on('seed', function(msg) {
    randomSeed = msg;

    clearMaze();

    generateMaze();
    displayMaze();
    drawUser();
    attachKeyListener();
    socket.emit('debug', 'CLIENT[?] ACTION: ACKNOWLEDGE=>SEED(' + msg + ')');
});
