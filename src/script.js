const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = 400;
const canvasHeight = 500;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var birdX = canvasWidth / 4;
var birdY = canvasHeight / 2;
var birdDY = 0;
const birdSize = 40;

var pipeX = canvasWidth;
var pipeGap = 200;
var pipeDY = -1.5;
const pipeWidth = 50;
var pipeHeight = canvasHeight - pipeGap - 50;
var pipePassed = false;

var playerCoins = 0;
var coinX = canvasWidth;
var coinY = (canvasHeight - pipeGap);
const coinSize = 40;

var score = 0;

var intervalID;

var isGameOver = false;

const gravity = 0.1;

const sound_background = new Audio("sounds/bgsound-30min.mp3");
const sound_jump = new Audio("sounds/jump.ogg");
const sound_die = new Audio("sounds/loose-sound.mp3");
sound_background.play();

function drawBird() {
  const birdImg = new Image();
  birdImg.src = "img/flappy.png";
  ctx.drawImage(birdImg, birdX, birdY, birdSize, birdSize);
}

function drawPipe() {
  const pipeImgBot = new Image();
  pipeImgBot.src = "img/top.png";
  ctx.drawImage(pipeImgBot, pipeX, 0, pipeWidth, pipeHeight);
  
  const pipeImgTop = new Image();
  pipeImgTop.src = "img/bot.png";
  ctx.drawImage(pipeImgTop, pipeX, pipeHeight + pipeGap, pipeWidth, canvasHeight - pipeHeight - pipeGap);
}

function drawCoin() {
  const coinImg = new Image();
  coinImg.src = "img/coin.png";
  ctx.drawImage(coinImg, coinX, coinY, coinSize, coinSize); 
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Coins: " + playerCoins, 10, 60);
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
    coinPassed = false;
  }

  if (pipeX === birdX - pipeWidth / 2) {
    score++;
    pipePassed = true;
  }

  // Check collision with pipes
  if (
    birdX + birdSize > pipeX && 
    birdX < pipeX + pipeWidth &&
    (birdY < pipeHeight || birdY + birdSize > pipeHeight + pipeGap)
    ){
    gameOver();
  }
}

function updateCoin() {
  coinX -= 1;

  // Check collision with bird
  if (
    birdX + birdSize > coinX &&
    birdX - birdSize < coinX + coinSize &&
    birdY + birdSize > coinY &&
    birdY - birdSize < coinY + coinSize
  ) {
    playerCoins++;
    coinX = -coinSize;
  }

  // Générer une nouvelle piece
  if(coinX < -coinSize) {
    coinX = canvasWidth;
    coinY = Math.floor(Math.random() * (canvasHeight - pipeGap - 100)) + 50;
    while(
        coinX + coinSize > pipeX &&
        coinX - coinSize < pipeX + pipeWidth &&
        (coinY - coinSize < pipeHeight || coinY + coinSize > pipeHeight + pipeGap)) {
          coinX = canvasWidth;
          coinY = Math.floor(Math.random() * (canvasHeight - pipeGap - 100)) + 50;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  updateBird();
  updatePipe();
  updateCoin();

  drawPipe();
  drawBird();
  drawScore();
  drawCoin();

  if (birdY + birdSize > canvasHeight || birdY - birdSize < 0) {
    gameOver();
  }

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvasWidth / 2 - 120, canvasHeight / 2);
  }

  if (pipePassed && pipeX < birdX) {
    pipePassed = false;
  }
}

intervalID = setInterval(draw, 10);


// Déplacement du personnage
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" || event.code === "ArrowUp") {
    birdDY = -3;
    sound_jump.play();
  }
});


// Fonction Game over et redémarage du jeu
function gameOver() {
  console.log(birdY);
  console.log(pipeHeight);
  console.log(birdX);
  console.log(pipeX);
  isGameOver = true;
  clearInterval(intervalID);
  document.getElementById("restart-button").style.display = "block";
  sound_background.pause();
  //sound_die.play();
}

function restartGame() {
  birdX = canvasWidth / 4;
  birdY = canvasHeight / 2;
  birdDY = 0;

  pipeX = canvasWidth;
  pipeGap = 100;
  pipeDY = -1.5;
  pipeHeight = canvasHeight - pipeGap - 50;
  pipePassed = false;

  score = 0;

  isGameOver = false;

  document.getElementById("restart-button").style.display = "none";

  intervalID = setInterval(draw, 10);
}


 // Menus et boutons
  
 // Ajout du bouton restart :
const restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", restartGame);


//Ajout d'un menu avant de commencer une partie :
 var isStarted = false;

 function startGame() {
  isStarted = true;
  intervalID = setInterval(draw, 10);
}

function showMenu() {
  document.getElementById("menu").style.display = "block";
}

function hideMenu() {
  document.getElementById("menu").style.display = "none";
}

document.getElementById("start-button").addEventListener("click", function () {
  hideMenu();
  startGame();
});

document.getElementById("easy-button").addEventListener("click", function () {
  hideMenu();
  pipeGap = 200;
  pipeDY = -1;
  startGame();
});

document.getElementById("hard-button").addEventListener("click", function () {
  hideMenu();
  pipeGap = 75;
  pipeDY = -2;
  startGame();
});

showMenu();