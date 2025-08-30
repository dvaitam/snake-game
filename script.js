const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const size = 20;
const tileCount = canvas.width / size;
let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
const fruits = ['🍎', '🍊', '🍋', '🍉', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝'];
let food = {x: 15, y: 15, type: '🍎'};
let speed = 8;
let gameOver = false;
let lastTime = 0;
let score = 0;

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over');
const scoreValue = document.getElementById('score-value');
const finalScore = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart');
const mainMenuBtn = document.getElementById('main-menu');

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
mainMenuBtn.addEventListener('click', showMainMenu);

document.addEventListener('keydown', handleKeyPress);

function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  resetGame();
  requestAnimationFrame(gameLoop);
}

function restartGame() {
  gameOverScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  resetGame();
  requestAnimationFrame(gameLoop);
}

function showMainMenu() {
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}

function resetGame() {
  snake = [{x: 10, y: 10}];
  direction = {x: 0, y: 0};
  score = 0;
  gameOver = false;
  updateScore();
  placeFood();
}

function updateScore() {
  scoreValue.textContent = score;
}

function gameLoop(time) {
  if (gameOver) return;
  if (time - lastTime < 1000 / speed) {
    requestAnimationFrame(gameLoop);
    return;
  }
  lastTime = time;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (direction.x === 0 && direction.y === 0) return;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  head.x = (head.x + tileCount) % tileCount;
  head.y = (head.y + tileCount) % tileCount;

  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    updateScore();
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#00f';
  snake.forEach(s => {
    ctx.fillRect(s.x * size, s.y * size, size - 2, size - 2);
  });

  // Draw food
  ctx.font = `${size}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(food.type, food.x * size + size / 2, food.y * size + size / 2);
}

function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
  food.type = fruits[Math.floor(Math.random() * fruits.length)];
  if (snake.some(s => s.x === food.x && s.y === food.y)) {
    placeFood();
  }
}

function handleKeyPress(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = {x: 0, y: -1};
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = {x: 0, y: 1};
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = {x: -1, y: 0};
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = {x: 1, y: 0};
      break;
  }
}

function endGame() {
  gameOver = true;
  gameScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  finalScore.textContent = score;
}
