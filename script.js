const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('bestScore');

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
let clawDropping = false;

let gameStarted = false;
let gameInterval;

let score = 0;
let bestScore = 0;

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function startGame() {
    if (score > bestScore) {
        bestScore = score;
        updateBestScore();
    }
    resetGameState();
    if (!gameStarted) {
        gameStarted = true;
        gameInterval = setInterval(update, 20);
    }
}

function resetGameState() {
    craneX = canvas.width / 2;
    craneY = 50;
    moveLeft = false;
    moveRight = false;
    dropClaw = false;
    clawDropping = false;

    balls = [];
    score = 0;
    updateScore();

    let ballRadius = 20;
    class Ball {
        constructor(x, y, radius, color, points) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.points = points;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.fillText(this.points, this.x - 6, this.y + 4);
        }
        overlaps(otherBall) {
            const dx = this.x - otherBall.x;
            const dy = this.y - otherBall.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < this.radius + otherBall.radius;
        }
    }

    const colorsAndPoints = [
        { color: 'red', points: 1 },
        { color: 'blue', points: 2 },
        { color: 'green', points: 3 },
        { color: 'yellow', points: 4 },
        { color: 'purple', points: 5 }
    ];

    for (let i = 0; i < 10; i++) {
        balls.push(createRandomBall(ballRadius, Ball, colorsAndPoints[i % colorsAndPoints.length]));
    }

    function createRandomBall(ballRadius, Ball, colorAndPoints) {
        let ball;
        let overlaps;
        do {
            let x = Math.floor((canvas.width - 2 * ballRadius) * Math.random() + ballRadius);
            let y = Math.floor((canvas.height / 2 + ballRadius) + (canvas.height / 2 - 2 * ballRadius) * Math.random() + ballRadius);
            ball = new Ball(x, y, ballRadius, colorAndPoints.color, colorAndPoints.points);
            overlaps = balls.some(existingBall => ball.overlaps(existingBall));
        } while (overlaps);

        ball.draw();
        return ball;
    }
}

function keyDownHandler(event) {
    if (!clawDropping) {
        if (event.key === 'ArrowLeft') {
            moveLeft = true;
        } else if (event.key === 'ArrowRight') {
            moveRight = true;
        } else if (event.key === ' ') {
            dropClaw = true;
            clawDropping = true;
        }
    }
}

function keyUpHandler(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft = false;
    } else if (event.key === 'ArrowRight') {
        moveRight = false;
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCrane();
    checkCollision();

    if (moveLeft && craneX > 0) {
        craneX -= 5;
    }
    if (moveRight && craneX < canvas.width - craneWidth) {
        craneX += 5;
    }
    if (clawDropping) {
        if (craneY < canvas.height - clawHeight) {
            craneY += 5;
        } else {
            clawDropping = false;
            if (craneY + craneHeight + clawHeight >= canvas.height) {
                // Claw touches the bottom, restart the game
                gameStarted = false;
                clearInterval(gameInterval);
                startGame();
                return;
            }
        }
    } else if (!dropClaw) {
        craneY = 50;
    }

    balls.forEach(ball => ball.draw());

    if (balls.length === 0) {
        clearInterval(gameInterval);
        gameStarted = false;
        ctx.fillText("Game Over! All balls collected!", canvas.width / 2 - 100, canvas.height / 2);
        if (score > bestScore) {
            bestScore = score;
            updateBestScore();
        }
    }
}

function drawCrane() {
    ctx.fillStyle = '#000';
    // Draw the line holding the claw
    ctx.beginPath();
    ctx.moveTo(craneX + craneWidth / 2, 0);
    ctx.lineTo(craneX + craneWidth / 2, craneY);
    ctx.stroke();
    
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

function checkCollision() {
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        if (craneY + craneHeight + clawHeight >= ball.y && craneY + craneHeight <= ball.y + ball.radius && craneX <= ball.x + ball.radius && craneX + craneWidth >= ball.x) {
            score += ball.points;
            balls.splice(i, 1);
            updateScore();
        }
    }
}

function updateScore() {
    scoreDisplay.textContent = score;
}

function updateBestScore() {
    bestScoreDisplay.textContent = bestScore;
}
