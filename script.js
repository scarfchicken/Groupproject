// //Background color, the claw... (The art work)
// //Create different classes of balls with different scores
// //The collision of the claw and the ball
// //The collision

// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');
// const startButton = document.getElementById('startButton');

// let craneX = canvas.width / 2;
// let craneY = 50;
// let craneWidth = 100;
// let craneHeight = 20;
// let clawWidth = 20;
// let clawHeight = 20;
// let clawOpen = true;
// let moveLeft = false;
// let moveRight = false;
// let dropClaw = false;
// let gameStarted = false;

// startButton.addEventListener('click', startGame);
// document.addEventListener('keydown', keyDownHandler);
// document.addEventListener('keyup', keyUpHandler);

// function startGame() {
//     if (!gameStarted) {
//         gameStarted = true;
//         gameInterval = setInterval(update, 20);
//     }   
    
//     //Create Balls
//     // let canvas = document.getElementById("canvas");
//     // let ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     let ballRadius = 20;
//     class Ball {
//         //These are the ball properties
//         constructor(x, y, radius, color) {
//             this.x = x;
//             this.y = y;
//             this.radius = radius;
//             this.color = color;
//         }
//         //This method will draw the ball on the canvas as specified by its properties
//         draw() {
//             ctx.fillStyle = this.color;
//             ctx.beginPath();
//             ctx.moveTo(this.x, this.y);
//             ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
//             ctx.fill();
//         }
//     }
//     let balls = [];
//     //create 20 random balls and put them in the balls array
//     for(let i = 0; i < 20; i++) {
//         balls.push(createRandomBall());
//     }
//     //this function returns a randomly colored ball in a random position on the canvas
//     //and draws it on the canvas
//     function createRandomBall() {
//         let x = Math.floor((canvas.width - 2 * ballRadius) * Math.random() + 20);
//         let y = Math.floor((canvas.height - 2 * ballRadius) * Math.random() + 20);
//         let r = Math.floor(256 * Math.random());
//         let g = Math.floor(256 * Math.random());
//         let b = Math.floor(256 * Math.random());
//         let ball = new Ball(x, y, ballRadius, "rgb(" + r + ", " + g + ", " + b + ")");
//         ball.draw();
//         return ball;
//     }
// }

// function keyDownHandler(event) {
//     if (event.key === 'ArrowLeft') {
//         moveLeft = true;
//     } else if (event.key === 'ArrowRight') {
//         moveRight = true;
//     } else if (event.key === ' ') {
//         dropClaw = true;
//     }
// }

// function keyUpHandler(event) {
//     if (event.key === 'ArrowLeft') {
//         moveLeft = false;
//     } else if (event.key === 'ArrowRight') {
//         moveRight = false;
//     }
//     // } else if (event.key === ' ') {
//     //     dropClaw = false;
//     // }
// }

// function update() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawCrane();

//     if (moveLeft && craneX > 0) {
//         craneX -= 5;
//     }
//     if (moveRight && craneX < canvas.width - craneWidth) {
//         craneX += 5;
//     }
//     if (dropClaw && craneY < canvas.height - clawHeight) {
//         craneY += 5;
//     } else {
//         craneY = 50;
//         dropClaw = false;
//     }
// }

// function drawCrane() {
//     ctx.fillStyle = '#000';
//     ctx.fillRect(craneX, craneY, craneWidth, craneHeight);
//     ctx.fillRect(craneX + craneWidth / 2 - clawWidth / 2, craneY + craneHeight, clawWidth, clawHeight);
// }

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
let gameInterval;

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        gameInterval = setInterval(update, 20);
    }   

    // Clear any existing balls
    balls = [];

    // Create Balls
    let ballRadius = 20;
    class Ball {
        // These are the ball properties
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
        }
        // This method will draw the ball on the canvas as specified by its properties
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Create 20 random balls and put them in the balls array
    for (let i = 0; i < 20; i++) {
        balls.push(createRandomBall());
    }

    // This function returns a randomly colored ball in a random position on the canvas
    // and draws it on the canvas
    function createRandomBall() {
        let x = Math.floor((canvas.width - 2 * ballRadius) * Math.random() + ballRadius);
        let y = Math.floor((canvas.height - 2 * ballRadius) * Math.random() + ballRadius);
        let r = Math.floor(256 * Math.random());
        let g = Math.floor(256 * Math.random());
        let b = Math.floor(256 * Math.random());
        let ball = new Ball(x, y, ballRadius, `rgb(${r}, ${g}, ${b})`);
        ball.draw();
        return ball;
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

    // Draw the balls
    balls.forEach(ball => ball.draw());
}

function drawCrane() {
    ctx.fillStyle = '#000';
    ctx.fillRect(craneX, craneY, craneWidth, craneHeight);
    ctx.fillRect(craneX + craneWidth / 2 - clawWidth / 2, craneY + craneHeight, clawWidth, clawHeight);
}

let balls = [];