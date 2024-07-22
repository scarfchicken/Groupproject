const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

let craneX = canvas.width / 2;
let craneY = 50;
const craneWidth = 100;
const craneHeight = 20;
const clawWidth = 20;
const clawHeight = 50;
let clawOpen = true;
let moveLeft = false;
let moveRight = false;
let dropClaw = false;

let gameStarted = false;
let gameInterval;

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function startGame() {
    resetGameState();
    if (!gameStarted) {
        gameStarted = true;
        gameInterval = setInterval(update, 20);
    }
}

function resetGameState() {
    // Reset crane position
    craneX = canvas.width / 2;
    craneY = 50;

    // Reset controls
    moveLeft = false;
    moveRight = false;
    dropClaw = false;

    // Clear any existing balls
    balls = [];

    // Create new balls
    let ballRadius = 20;
    class Ball {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
        overlaps(otherBall) {
            const dx = this.x - otherBall.x;
            const dy = this.y - otherBall.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < this.radius + otherBall.radius;
        }
    }

    for (let i = 0; i < 10; i++) {
        balls.push(createRandomBall(ballRadius, Ball));
    }


    // This function returns a randomly colored ball in a random position on the canvas
    // and draws it on the canvas
    function createRandomBall() {
        let x = Math.floor((canvas.width - 2 * ballRadius) * Math.random() + ballRadius);
        let y = Math.floor((canvas.height - 2 * ballRadius - 150) * Math.random() + ballRadius) + 150;
        let r = Math.floor(256 * Math.random());
        let g = Math.floor(256 * Math.random());
        let b = Math.floor(256 * Math.random());
        let ball = new Ball(x, y, ballRadius, `rgb(${r}, ${g}, ${b})`);

    function createRandomBall(ballRadius, Ball) {
        let ball;
        let overlaps;
        do {
            let x = Math.floor((canvas.width - 2 * ballRadius) * Math.random() + ballRadius);
            let y = Math.floor((canvas.height / 2 + ballRadius) + (canvas.height / 2 - 2 * ballRadius) * Math.random() + ballRadius);
            let r = Math.floor(256 * Math.random());
            let g = Math.floor(256 * Math.random());
            let b = Math.floor(256 * Math.random());
            ball = new Ball(x, y, ballRadius, `rgb(${r}, ${g}, ${b})`);
            overlaps = balls.some(existingBall => ball.overlaps(existingBall));
        } while (overlaps);


        ball.draw();
        return ball;
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

    balls.forEach(ball => ball.draw());
}

function drawCrane() {
    ctx.fillStyle = '#000';
    if (clawOpen) {
        ctx.fillRect(craneX, craneY, craneWidth, craneHeight);
        ctx.fillRect(craneX, craneY + craneHeight, clawWidth, clawHeight);
        ctx.fillRect(craneX + 80, craneY + craneHeight, clawWidth, clawHeight);
    } else {
        ctx.fillRect(craneX, craneY, craneWidth, craneHeight);
        ctx.fillRect(craneX, craneY + craneHeight, clawWidth, clawHeight);
        ctx.fillRect(craneX + 80, craneY + craneHeight, clawWidth, clawHeight);
        ctx.fillRect(craneX + 60, craneY + craneHeight + clawHeight, clawWidth + 20, craneHeight);
        ctx.fillRect(craneX, craneY + craneHeight + clawHeight, clawWidth + 20, craneHeight);
    }
}

let balls = [];
