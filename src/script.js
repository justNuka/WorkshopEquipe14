const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var birdX = canvas.width / 4;
var birdY = canvas.height / 2;
var birdDY = 0;
const birdSize = 20;

var pipeX = canvas.width;
var pipeGap = 100;
var pipeDY = -1.5;
const pipeWidth = 30;
var pipeHeight = canvas.height - pipeGap - 50;
var pipePassed = false;

var score = 0;

var intervalID;

function drawBird() {
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.arc(birdX, birdY, birdSize, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipe() {
  ctx.fillStyle = "green";
  ctx.fillRect(pipeX, 0, pipeWidth, pipeHeight);
  ctx.fillRect(pipeX, pipeHeight + pipeGap, pipeWidth, canvas.height - pipeGap - pipeHeight);
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 10, 30);
}

function updateBird() {
  birdDY += 0.2;
  birdY += birdDY;
  if (birdY < birdSize || birdY > canvas.height - birdSize) {
    gameOver();
  }
}

function updatePipe() {
  pipeX -= 2;
  if (pipeX < -pipeWidth) {
    pipeX = canvas.width;
    pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 50)) + 50;
    pipePassed = false;
  }
  if (pipeX < birdX && !pipePassed) {
    score++;
    pipePassed = true;
  }
  if (birdX + birdSize > pipeX && birdX - birdSize < pipeX + pipeWidth &&
      (birdY - birdSize < pipeHeight || birdY + birdSize > pipeHeight + pipeGap)) {
    gameOver();
  }
}

function gameOver() {
  document.getElementById("game-over").innerHTML = "Game Over! Your score is " + score;
  clearInterval(intervalID);
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipe();
  drawScore();
  updateBird();
  updatePipe();
}

document.addEventListener("keydown", function(event) {
  if (event.code === "Space") {
    birdDY = -5;
  }
});

canvas.addEventListener("click", function() {
  birdDY = -5;
});

intervalID = setInterval(draw, 10);