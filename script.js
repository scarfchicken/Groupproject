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
let clawRising = false;
let gameStarted = false;
let gameInterval;
let autoBallRaf;

let score = 0;
let bestScore = 0;
let resetClaw = false;

let gameOver = false;
let balls = [];
let bombs = [];
let running = false;

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function createBalls() {
    balls = [];
    score = 0;
    updateScore();

    let timeLeft = 60;
    document.getElementById("TimeLeft").textContent = "Time left: " + timeLeft.toString();
    let timer = setInterval(decrementTime, 1000);

    function decrementTime() {
        timeLeft -= 1;
        if (timeLeft < 1) {
            document.getElementById("TimeLeft").textContent = "Time's Up!";
            clearInterval(timer);
            gameOver = true;
            clearInterval(gameInterval);
            startButton.style.display = "block";
            startButton.addEventListener('click', resetGameState);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            running = false;
            return;
        }
        document.getElementById("TimeLeft").textContent = "Time left: " + timeLeft.toString();
    }

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
            ctx.font = '12px Arial';
            if (this.color === 'black') {
                ctx.fillStyle = '#FF0000';
                ctx.fillText("Bomb", this.x - 15, this.y + 4);
            } else {
                ctx.fillStyle = '#000';
                ctx.fillText(this.points, this.x - 6, this.y + 4);
            }
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

    for (let i = 0; i < 20; i++) {
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

function checkCollision() {
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        if (craneY + craneHeight + clawHeight >= ball.y &&
            craneY + craneHeight <= ball.y + ball.radius &&
            craneX <= ball.x + ball.radius &&
            craneX + craneWidth >= ball.x) {
            score += ball.points;
            balls.splice(i, 1);
            updateScore();
        }
    }
}

function checkCollisionWhile() {
    let i = balls.length - 1;
    while (i >= 0 && resetClaw == false) {
        const ball = balls[i];
        if (craneY + craneHeight + clawHeight >= ball.y &&
            craneY + craneHeight <= ball.y + ball.radius &&
            craneX <= ball.x + ball.radius &&
            craneX + craneWidth >= ball.x) {
            resetClaw = true;
        }
        i--;
    }
    return resetClaw;
}

function startGame() {
    if (score > bestScore) {
        bestScore = score;
        updateBestScore();
    }
    resetGameState();
    createBalls();
    if (bombs.length == 0) {
        createMovingBomb();
    }
    createAutoMovingBall();
    if (!gameStarted) {
        gameStarted = true;
        gameInterval = setInterval(update, 20);
        startButton.style.display = "none";
        startButton.removeEventListener('click', startGame);
    }
}

function resetGameState() {
    craneX = canvas.width / 2;
    craneY = 50;
    moveLeft = false;
    moveRight = false;
    dropClaw = false;
    clawDropping = false;
    clawRising = false;
    score = 0;
    updateScore();
    balls = [];
    bombs = [];
    createBalls();
    createMovingBomb();
    createAutoMovingBall();
    clearInterval(gameInterval);
    cancelAnimationFrame(autoBallRaf);
    gameInterval = setInterval(update, 20);
    startButton.style.display = "none";
    gameOver = false;
    gameStarted = true;
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
            clawRising = true;
            clawOpen = false;
        }
    } else if (!dropClaw) {
        craneY = 50;
    }
    if (craneY <= 50) {
        clawRising = false;
        clawOpen = true;
    } else if (clawRising) {
        craneY -= 5;
        clawDropping = false;
        moveRight = false;
        moveLeft = false;
    }
    for (let ball of balls) {
        ball.draw();
    }
    for (let bomb of bombs) {
        bomb.move();
    }
    checkCollision();
    if (balls.length === 0) {
        clearInterval(gameInterval);
        gameStarted = false;
        startButton.style.display = "block";
        startButton.addEventListener('click', startGame);
        if (score > bestScore) {
            bestScore = score;
            updateBestScore();
        }
    }
}

function drawCrane() {
    ctx.fillStyle = '#000';
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
        ctx.fillRect(craneX + 20, craneY + craneHeight + clawHeight, clawWidth + 20, craneHeight);
        ctx.fillRect(craneX + 60, craneY + craneHeight + clawHeight, clawWidth + 20, craneHeight);
        ctx.fillRect(craneX, craneY + craneHeight + clawHeight, clawWidth + 20, craneHeight);
    }
}

function updateScore() {
    scoreDisplay.textContent = score;
}

function updateBestScore() {
    bestScoreDisplay.textContent = bestScore;
}

function createMovingBomb() {
    let ballRadius = 20;

    class Bomb {
        constructor(x, y, radius, color, points) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.points = points;
            this.moveSpeed = 3;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.font = '12px Arial';
            ctx.fillStyle = '#FF0000';
            ctx.fillText("Bomb", this.x - 15, this.y + 4);
        }

        move() {
            this.x += this.moveSpeed;
            if (this.x > canvas.width || this.x < 0) {
                this.moveSpeed = -this.moveSpeed;
            }
            if (this.checkPlayerCollision()) {
                score -= 10;
                updateScore();
                bombs = bombs.filter(bomb => bomb !== this);
                resetClaw = true;
            }
            this.draw();
        }

        checkPlayerCollision() {
            return craneY + craneHeight + clawHeight >= this.y &&
                craneY + craneHeight <= this.y + this.radius &&
                craneX <= this.x + this.radius &&
                craneX + craneWidth >= this.x;
        }

        overlaps(otherBall) {
            const dx = this.x - otherBall.x;
            const dy = this.y - otherBall.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < this.radius + otherBall.radius;
        }
    }

    for (let i = 0; i < 3; i++) {
        let bomb;
        let overlaps;
        do {
            let x = Math.floor((canvas.width - 2 * ballRadius) * Math.random() + ballRadius);
            let y = Math.floor((canvas.height / 2 + ballRadius) + (canvas.height / 2 - 2 * ballRadius) * Math.random() + ballRadius);
            bomb = new Bomb(x, y, ballRadius, 'black', -1);
            overlaps = bombs.some(existingBomb => bomb.overlaps(existingBomb));
        } while (overlaps);
        bombs.push(bomb);
    }
}

function createAutoMovingBall() {
    class Ball {
        constructor(x, y, dx, dy, radius, color) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;
            this.color = color;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        }

        checkPlayerCollisionBox() {
            return craneY + craneHeight + clawHeight >= this.y &&
                craneY + craneHeight <= this.y + this.radius &&
                craneX <= this.x + this.radius &&
                craneX + craneWidth >= this.x;
        }
    }

    autoBall = new Ball(50, 50, 5, 10, 25, "violet");
    running = true;
    moveBalls();

    function autoMoveBall() {
        autoBall.x += autoBall.dx;
        autoBall.y += autoBall.dy;
        if (autoBall.x > canvas.width - autoBall.radius || autoBall.x < autoBall.radius) {
            autoBall.dx = -autoBall.dx;
        }
        if (autoBall.y > canvas.height - autoBall.radius || autoBall.y < autoBall.radius) {
            autoBall.dy = -autoBall.dy;
        }
        if (autoBall.checkPlayerCollisionBox()) {
            score += 15;
            updateScore();
            bombs = bombs.filter(bomb => bomb !== this);
            resetClaw = true;
        }
    }

    function moveBalls() {
        if (running) {
            autoMoveBall();
            autoBall.draw();
        }
        raf = window.requestAnimationFrame(moveBalls);
    }

    autoBallRaf = raf; // store the raf ID
}
