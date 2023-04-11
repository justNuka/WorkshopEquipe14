const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = 400;
const canvasHeight = 500;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let birdX = canvasWidth / 4;
let birdY = canvasHeight / 2;
let birdDY = 0;
const birdSize = 20;

let pipeX = canvasWidth;
let pipeGap = 100;
let pipeDY = -1.5;
const pipeWidth = 50;
let pipeHeight = canvasHeight - pipeGap - 50;
let pipePassed = false;

let score = 0;

let intervalID;

let isGameOver = false;

const gravity = 0.1;

function drawBird() {
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.arc(birdX, birdY, birdSize, 0, 2 * Math.PI);
  ctx.fill();
}

function drawPipe() {
  ctx.fillStyle = "green";
  ctx.fillRect(pipeX, 0, pipeWidth, pipeHeight);
  ctx.fillRect(pipeX, pipeHeight + pipeGap, pipeWidth, canvasHeight - pipeHeight - pipeGap);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function updateBird() {
  birdDY += gravity;
  birdY += birdDY;
}

function updatePipe() {
  pipeX -= 1;

  if (pipeX <= -pipeWidth) {
    pipeX = canvasWidth;
    pipeHeight = Math.floor(Math.random() * (canvasHeight - pipeGap - 100)) + 50;
    pipePassed = false;
  }

  if (pipeX === birdX - pipeWidth / 2) {
    score++;
    pipePassed = true;
  }

  // Check collision
  if (
    birdX + birdSize > pipeX &&
    birdX - birdSize < pipeX + pipeWidth &&
    (birdY - birdSize < pipeHeight || birdY + birdSize > pipeHeight + pipeGap)
  ) {
    gameOver();
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(intervalID);
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  updateBird();
  updatePipe();

  drawPipe();
  drawBird();
  drawScore();

  if (birdY + birdSize > canvasHeight || birdY - birdSize < 0) {
    gameOver();
  }

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvasWidth / 2 - 120, canvasHeight / 2);
  }
}

intervalID = setInterval(draw, 10);

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    birdDY = -3;
  }
});
