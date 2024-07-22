const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

let craneX = canvas.width / 2;
let craneY = 50;
let craneWidth = 100;
let craneHeight = 20;
let clawWidth = 20;
let clawHeight = 50;
let clawOpen = true;
let moveLeft = false;
let moveRight = false;
let dropClaw = false;
let gameStart = false;

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function startGame() {
    if(!gameStart){
        gameStart = true;
        setInterval(update, 20);
    }
    
}

function keyDownHandler(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft = true;
    } else if (event.key === 'ArrowRight') {
        moveRight = true;
    } else if (event.key === ' ') {
        dropClaw = true;
    }
}

function keyUpHandler(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft = false;
    } else if (event.key === 'ArrowRight') {
        moveRight = false;
    }
    // } else if (event.key === ' ') {
    //     dropClaw = false;
    // }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCrane();

    if (moveLeft && craneX > 0) {
        craneX -= 5;
    }
    if (moveRight && craneX < canvas.width - craneWidth) {
        craneX += 5;
    }
    if (dropClaw && craneY < canvas.height - clawHeight) {
        craneY += 5;
    } else {
        craneY = 50;
        dropClaw = false;
    }
}

function drawCrane() {
    ctx.fillStyle = '#000';
    if(clawOpen){
        ctx.fillRect(craneX, craneY, craneWidth, craneHeight);
        ctx.fillRect(craneX , craneY + craneHeight, clawWidth, clawHeight);
        ctx.fillRect(craneX + 80, craneY + craneHeight, clawWidth, clawHeight);
        
    }
    else{
        ctx.fillRect(craneX, craneY, craneWidth, craneHeight);
        ctx.fillRect(craneX , craneY + craneHeight, clawWidth, clawHeight);
        ctx.fillRect(craneX + 80, craneY + craneHeight, clawWidth, clawHeight);
        ctx.fillRect(craneX + 60, craneY + craneHeight+clawHeight, clawWidth+20, craneHeight);
        ctx.fillRect(craneX, craneY + craneHeight + clawHeight, clawWidth+20, craneHeight);
        
    }
}
