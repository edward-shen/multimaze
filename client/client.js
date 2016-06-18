
var xSize = 31, ySize = 21;

var playingField = createArray(ySize * 2 + 1, xSize * 2 + 1);
var randomSeed = "setset"; // Debug variable when defined. Should be defined by server later

/* Yay helper functions (from StackOverflow).
 * Creates an n-dimensional array, with n equaling the number of parameters provided
 * i.e. createArray(5) generates a 1D array with 5 elements, and createArray(5,3) creates a 2D array... etc. etc.
 */
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function generateMaze() {

    var i; // Loop variable
    //Math.seedrandom(randomSeed);
    var numNodes = ySize * xSize;

    var representativeArray = createArray(numNodes),
        edgeArray = createArray(2 * numNodes);

    // Initializes our representative array; their IDs are just arbitrary values
    for (i = 0; i < representativeArray.length; i++) {
        representativeArray[i] = i;
    }

    console.log(edgeArray.length);

    // Initalizes our edgeArray
    for (i = 0; i < edgeArray.length / 2; i++){

        if (i % xSize + 1 !== xSize) {
            edgeArray[i] = {weight: Math.random(), startPos: {y: Math.floor(i / xSize), x: i % xSize}, endPos: {y: Math.floor(i / xSize), x: (i % xSize) + 1}};
        }

        if (Math.floor(i / xSize) + 1 !== ySize) {
            edgeArray[numNodes + i] = {weight: Math.random(), startPos: {y: Math.floor(i / xSize), x: i % xSize}, endPos: {y: Math.floor(i / xSize) + 1, x: (i % xSize)}};
        }
    }


    // Sorts edges by their weight property
    edgeArray.sort(function(a, b) {
        return a.weight - b.weight;
    });

    while (typeof edgeArray[0] !== 'undefined') {
        var startPos = edgeArray[0].startPos.y * xSize + edgeArray[0].startPos.x,
            endPos = edgeArray[0].endPos.y * xSize + edgeArray[0].endPos.x;

            var representative = representativeArray[startPos];
            var toBeReplaced = representativeArray[endPos];
            if (representative !== toBeReplaced) {
                for (i = 0; i < representativeArray.length; i++) {
                    if (representativeArray[i] === toBeReplaced) {
                        representativeArray[i] = representative;
                    }
                }
                drawField();
            }

        edgeArray.shift();
    }

    function drawField() {
        console.log(edgeArray[0]);
        var startPos = edgeArray[0].startPos,
            endPos = edgeArray[0].endPos;

        var startPosX = startPos.x * 2 + 1,
            startPosY = startPos.y * 2 + 1,
            endPosX = endPos.x * 2 + 1;
            endPosY = endPos.y * 2 + 1;

            playingField[startPosY][startPosX] = 1;
            playingField[(startPosY + endPosY) / 2][(startPosX + endPosX) / 2] = 1;
            playingField[endPosY][endPosX] = 1;
        }
};

generateMaze();

// Just writes what our playing field is
document.write("<div style=\"line-height:0\">");
for (i=0; i < playingField.length; i++) {
   for (j = 0; j < playingField[i].length; j++) {
       if (typeof playingField[i][j] !== 'undefined')
            document.write("<img src=\"black.png\"/>");
        else
        document.write("<img src=\"grey.png\"/>");
    }
   document.write("<br/>");
}
document.write("</div>");
