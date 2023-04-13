const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = 480;
const canvasHeight = 580;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var bossX = canvasWidth / 4;
var bossY = canvasHeight / 2;
var bossDY = 0;
const bossSize = 40;

var obstacleX = canvasWidth;
var obstacleGap = 100;
var obstacleDY = -1.5;
const obstacleWidth = 50;
var obstacleHeight = canvasHeight - obstacleGap - 50;
var obstaclePassed = false;

var playerCoins = 0;
var coinX = canvasWidth;
var coinY = (canvasHeight - obstacleGap);
const coinSize = 40;

var difficulty = 10;

// Ajout d'un écouteur d'événements sur les boutons de difficulté
const easyButton = document.getElementById("easy");
const mediumButton = document.getElementById("medium");
const hardButton = document.getElementById("hard");
easyButton.addEventListener("click", setDifficulty);
mediumButton.addEventListener("click", setDifficulty);
hardButton.addEventListener("click", setDifficulty);

var score = 0;

var intervalID;

var isGameOver = false;

const gravity = 0.1;

const sound_background = new Audio("sounds/bgsound-30min.mp3");
const sound_jump = new Audio("sounds/jump.ogg");
const sound_die = new Audio("sounds/loose-sound.mp3");
const sound_coin = new Audio("sounds/coin.mp3");
sound_coin.volume = 0.2;
sound_jump.volume = 0.3;
sound_die.volume = 0.05;

function drawboss() {
  const bossImg = new Image();
  bossImg.src = "img/flappy.png";
  ctx.drawImage(bossImg, bossX, bossY, bossSize, bossSize);
}

function drawobstacle() {
  const obstacleImgBot = new Image();
  obstacleImgBot.src = "img/top.png";
  ctx.drawImage(obstacleImgBot, obstacleX, 0, obstacleWidth, obstacleHeight);
  
  const obstacleImgTop = new Image();
  obstacleImgTop.src = "img/bot.png";
  ctx.drawImage(obstacleImgTop, obstacleX, obstacleHeight + obstacleGap, obstacleWidth, canvasHeight - obstacleHeight - obstacleGap);
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

function updateboss() {
  bossDY += gravity;
  bossY += bossDY;
}

function updateobstacle() {
  obstacleX -= 1;

  if (obstacleX <= -obstacleWidth) {
    obstacleX = canvasWidth;
    obstacleHeight = Math.floor(Math.random() * (canvasHeight - obstacleGap - 100)) + 50;
    obstaclePassed = false;
    coinPassed = false;
  }

  if (obstacleX === bossX - obstacleWidth / 2) {
    score++;
    obstaclePassed = true;
  }

  // Check collision with obstacles
  if (
    bossX + bossSize > obstacleX && 
    bossX < obstacleX + obstacleWidth &&
    (bossY < obstacleHeight || bossY + bossSize > obstacleHeight + obstacleGap)
    ){
    gameOver();
  }
}

function updateCoin() {
  coinX -= 1;

  // Check collision with boss
  if (
    bossX + bossSize > coinX &&
    bossX - bossSize < coinX + coinSize &&
    bossY + bossSize > coinY &&
    bossY - bossSize < coinY + coinSize
  ) {
    sound_coin.play();
    playerCoins++;
    coinX = -coinSize;
  }

  // Générer une nouvelle piece
  if(coinX < -coinSize) {
    do {
      coinX = canvasWidth;
      coinY = Math.floor(Math.random() * (canvasHeight - obstacleGap - 100)) + 50;
    }
    while(
        coinX + coinSize > obstacleX &&
        coinX - coinSize < obstacleX + obstacleWidth &&
        (coinY - coinSize < obstacleHeight || coinY + coinSize > obstacleHeight + obstacleGap)) {
          coinX = canvasWidth;
          coinY = Math.floor(Math.random() * (canvasHeight - obstacleGap - 100)) + 50;
    }
  }
}

function setDifficulty(event) {
  const selectedDifficulty = event.target.id;
  switch (selectedDifficulty) {
    case "easy":
      gameOver();
      difficulty = 10;
      obstacleGap = 200;
      event.target.blur();
      restartGame();
      break;
    case "medium":
      gameOver();
      difficulty = 9;
      obstacleGap = 150;
      event.target.blur();
      restartGame();
      break;
    case "hard":
      gameOver();
      difficulty = 8;
      obstacleGap = 100;
      event.target.blur();
      restartGame();
      break;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  updateboss();
  updateobstacle();
  updateCoin();

  drawobstacle();
  drawboss();
  drawScore();
  drawCoin();

  if (bossY + bossSize > canvasHeight) {
    gameOver();
  }

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvasWidth / 2 - 120, canvasHeight / 2);
  }

  if (obstaclePassed && obstacleX < bossX) {
    obstaclePassed = false;
  }
}


// Classement


intervalID = setInterval(draw, difficulty);


// Déplacement du personnage
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" || event.code === "ArrowUp") {
    bossDY = -3;
    sound_jump.play();
  }
});


// Fonction Game over et redémarage du jeu
function gameOver() {
  console.log(bossY);
  console.log(obstacleHeight);
  console.log(bossX);
  console.log(obstacleX);
  isGameOver = true;
  clearInterval(intervalID);
  document.getElementById("restart-button").style.display = "block";
  sound_background.pause();
  sound_die.play();
  sound_jump.volume = 0;

  // Enregistrement du joueur et de son score
  const username = sessionStorage.getItem("username");
  // Données à ajouter au fichier JSON
  const newScore = {
    pseudo: username,
    score: score,
  };

  // Envoi d'une requête AJAX POST à l'end point /leaderboard pour ajouter les nouvelles données
  $.ajax({
    type: "POST",
    url: "https://temp3.leod1.site/leaderboard",
    contentType: "application/json",
    data: JSON.stringify(newScore),
    success: function() {
      console.log("Données ajoutées avec succès !");
    },
    error: function() {
      console.log("Une erreur s'est produite lors de l'ajout des données");
    }
  });
}

function restartGame() {
  bossX = canvasWidth / 4;
  bossY = canvasHeight / 2;
  bossDY = 0;

  obstacleX = canvasWidth;
  obstacleGap = 100;
  obstacleDY = -1.5;
  obstacleHeight = canvasHeight - obstacleGap - 50;
  obstaclePassed = false;

  coinX = canvasWidth;
  coinY = obstacleHeight;

  score = 0;

  isGameOver = false;

  document.getElementById("restart-button").style.display = "none";

  sound_jump.volume = 0.3;

  intervalID = setInterval(draw, difficulty);
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
  obstacleGap = 200;
  obstacleDY = -1;
  startGame();
});

document.getElementById("hard-button").addEventListener("click", function () {
  hideMenu();
  obstacleGap = 75;
  obstacleDY = -2;
  startGame();
});

showMenu();