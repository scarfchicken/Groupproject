const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

let craneX = canvas.width / 2;
let craneY = 50;
let craneWidth = 100;
let craneHeight = 20;
let clawWidth = 20;
let clawHeight = 20;
let clawOpen = true;
let moveLeft = false;
let moveRight = false;
let dropClaw = false;
let gameStarted = false;

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        setInterval(update, 20);
    }
}

function keyDownHandler(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft = true;
    } else if (event.key === 'ArrowRight') {
        moveRight = true;
    } else if (event.key === 'Space') {
        dropClaw = true;
    }
}

function keyUpHandler(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft = false;
    } else if (event.key === 'ArrowRight') {
        moveRight = false;
    } else if (event.key === 'Space') {
        dropClaw = false;
    }
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
    ctx.fillRect(craneX, craneY, craneWidth, craneHeight);
    ctx.fillRect(craneX + craneWidth / 2 - clawWidth / 2, craneY + craneHeight, clawWidth, clawHeight);
}
