var canvas;
var context;

const box_size = 60;
const all_boxes = 225;
const max_rand = 14;
const delay = 150;
const height = 930;
const width = 900;

var rbc;
var rbc_coords = new Array(all_boxes);

var organ;
var organ_coords;

var end_organ_tracker = 0

var len;

var left = false;
var up = true;
var right = false;
var down = false;

var inGame = true;
var winState = false;
var score = 0;

const left_key = 37;
const up_key = 38;
const right_key = 39;
const down_key = 40;


const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

function initialize() {

    canvas = document.getElementById('game_canvas');
    context = canvas.getContext('2d');

    context.fillStyle = 'white'
    context.textBaseline = "middle"
    context.textAlign = 'center'
    context.font = 'normal 90px arial'
    context.fillText('Anatomy Snake!', 450, 300)

    context.font = 'normal 45px arial'
    context.fillText('Click here to play!', 450, 450)

    context.font = 'normal 30px arial'
    context.fillText('Instructions: Use the arrow keys to get the RBCs to the organs!', 450, 600)

    canvas.onclick = function() {startup()}
    
}

function startup() {

    initialImages();
    buildRBC();
    getNewOrgan();
    setTimeout("game()", delay);

}

function initialImages() {

    rbc = new Image();
    rbc.src = 'dox_rbc.png';

    organ = new Image();
    organ.src = 'right_heart.png';

}

function buildRBC() {

    len = 3;
    for (var length_counter = 0; length_counter < len; length_counter++) {
        rbc_coords[length_counter] = [7, 7 + length_counter];
    }
}

function getNewOrgan() {

    let all_coords = cartesian(Array.from(Array(15).keys()),Array.from(Array(15).keys()));

    rbc_coords.forEach(function(item){

        for (var all_coords_i = all_coords.length-1; all_coords_i >=0; all_coords_i--) {

            if (item.every((value,index) => value === all_coords[all_coords_i][index])) {
                all_coords.splice(all_coords_i, 1);
                break;
            }
        }
    })
    organ_coords = all_coords[Math.floor(Math.random()*all_coords.length)];
}

function game() {

    if (inGame) {
        checkCollision();
        checkOrgan();
        move();
        drawGame();
        setTimeout("game()", delay);
    }
}

function move() {

    for (var rbc_index = len-1; rbc_index > 0; rbc_index--) {rbc_coords[rbc_index] = [...rbc_coords[(rbc_index-1)]]};
    
    if (left) {rbc_coords[0][0] = rbc_coords[0][0]-1} 
    else if (up) {rbc_coords[0][1] = rbc_coords[0][1] -1} 
    else if (right) {rbc_coords[0][0]++} 
    else if (down) {rbc_coords[0][1]++} 
    else {console.log("Could not recognize keyboard keys.")};
}

function checkCollision() {

    for (var rbc_index = len-1; rbc_index > 0; rbc_index--) {

        if (rbc_coords[rbc_index].every((value,index) => value === rbc_coords[0][index])) {inGame = false;}
    }

    if (rbc_coords[0][0] < 0) {inGame = false}
    else if (rbc_coords[0][0] > 14) {inGame = false}
    else if (rbc_coords[0][1] < 0) {inGame = false}
    else if (rbc_coords[0][1] > 14) {inGame = false};
}

function checkOrgan() {

    if (organ_coords.every((value,index) => value === rbc_coords[0][index])) {

        len++;
        score++

        if (score == 222) {winState = true}
        getNewOrgan();
        updateImages();
    }
}

function updateImages() {

    let filename = organ.src.replace(/^.*[\\\/]/, '');

    if (filename == 'right_heart.png') {
        organ.src = 'lung.png';
    } else if (filename == 'lung.png') {
        organ.src = 'left_heart.png';
        rbc.src = 'ox_rbc.png';
    } else if (filename == 'left_heart.png') {
        organ.src = end_organ_tracker % 7 + '.png';
        end_organ_tracker++;
    } else if (filename == '1.png') {
        organ.src = 'liver.png';
        rbc.src = 'dox_rbc.png';
    } else {
        organ.src = 'right_heart.png';
        rbc.src = 'dox_rbc.png';
    }

}

function drawGame() {

    context.clearRect(0, 0, width, height)

    if (winState) {winGame();}
    else if (inGame) {

        context.drawImage(organ, organ_coords[0] * box_size, organ_coords[1] * box_size);

        for (var rbc_index = 0; rbc_index < len; rbc_index++) {
            context.drawImage(rbc, rbc_coords[rbc_index][0] * box_size, rbc_coords[rbc_index][1] * box_size)
        }

        context.fillStyle = 'black'
        context.fillRect(0, 900, 900, 930)

        context.fillStyle = 'green'
        context.fillRect(0, 900, score * 900/222, 930)

        context.strokeStyle = 'green';

        context.beginPath();
        context.moveTo(0, 900);
        context.lineTo(900, 900);
        context.closePath();
        context.stroke();


        context.fillStyle = 'white'
        context.font = 'normal 25px arial'
        context.fillText('Score: ' + score, 450, 915)
    } else {gameOver();}
}

function winGame() {

    context.clearRect(0, 0, width, height)

    context.font = 'normal 90px arial';
    context.fillText('Congratulations!', 450, 300);
    context.fillText('You won!', 450, 400);

    context.font = 'normal 45px arial';
    context.fillText('Click here to play again!', 450, 600);

    canvas.onclick = function() {
        resetGame();
        startup();}

}

function gameOver() {

    context.clearRect(0, 0, width, height)

    context.font = 'normal 90px arial';
    context.fillText('Game Over!', 450, 300);

    context.font = 'normal 45px arial';
    context.fillText('Score: ' + score, 450, 450);

    context.fillText('Click here to try again!', 450, 600);

    canvas.onclick = function() {
        resetGame();
        startup();}
}

function resetGame() {

    context.clearRect(0, 0, width, height)

    rbc_coords = new Array(all_boxes);
    end_organ_tracker = 0

    left = false;
    up = true;
    right = false;
    down = false;

    inGame = true;
    winState = false;
    score = 0;

}

onkeydown = function(event) {

    var key = event.keyCode;

    if ((key == left_key) && (!right)) {

        left = true;
        up = false;
        down = false;

    } else if ((key == up_key) && (!down)) {

        up = true;
        left = false;
        right = false;

    } else if ((key == right_key) && (!left)) {

        right = true;
        up = false;
        down = false;

    } else if ((key == down_key) && (!up)) {

        down = true;
        left = false;
        right = false;

    } else {console.log("There is a problem with recognizing the keys!")}

}

