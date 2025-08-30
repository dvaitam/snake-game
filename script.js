const canvas = document.getElementById(game);
const ctx = canvas.getContext(2d);
const size = 20;
const tileCount = canvas.width / size;
let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
const fruits = [🍎, 🍊, 🍌, 🍉, 🍇, 🍓, 🍒, 🍑, 🍍, 🥝];
let food = {x: 15, y: 15, emoji: 🍎};
let speed = 8;
let gameOver = false;
let lastTime = 0;
let foodHue = 0;
let score = 0;

// DOM elements
const startScreen = document.getElementById(start-screen);
const gameScreen = document.getElementById(game-screen);
const gameOverScreen = document.getElementById(game-over);
const scoreValue = document.getElementById(score-value);
const finalScore = document.getElementById(final-score);
const startBtn = document.getElementById(start-btn);
const restartBtn = document.getElementById(restart);
const mainMenuBtn = document.getElementById(main-menu);

// Event listeners
startBtn.addEventListener(click, startGame);
restartBtn.addEventListener(click, restartGame);
mainMenuBtn.addEventListener(click, showMainMenu);

document.addEventListener(keydown, handleKeyPress);

function startGame() {
  startScreen.classList.add(hidden);
  gameScreen.classList.remove(hidden);
  resetGame();
  requestAnimationFrame(gameLoop);
}

function restartGame() {
  gameOverScreen.classList.add(hidden);
  gameScreen.classList.remove(hidden);
  resetGame();
  requestAnimationFrame(gameLoop);
}

function showMainMenu() {
  gameOverScreen.classList.add(hidden);
  startScreen.classList.remove(hidden);
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
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, #1a1a2e);
  gradient.addColorStop(1, #16213e);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food with glow effect
  ctx.shadowColor = `hsl(${foodHue}, 100%, 50%)`;
  ctx.shadowBlur = 15;
  ctx.font = `${size}px Arial`;
  ctx.textAlign = center;
  ctx.textBaseline = middle;
  ctx.fillText(food.emoji, food.x * size + size / 2, food.y * size + size / 2);
  ctx.shadowBlur = 0;
  foodHue = (foodHue + 4) % 360;

  // Draw snake with gradient
  const snakeGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  snakeGradient.addColorStop(0, #00ff88);
  snakeGradient.addColorStop(1, #00cc66);
  ctx.fillStyle = snakeGradient;
  snake.forEach((part, index) => {
    if (index === 0) {
      // Head is slightly larger and brighter
      ctx.shadowColor = #00ff88;
      ctx.shadowBlur = 10;
      ctx.fillRect(part.x * size + 1, part.y * size + 1, size - 2, size - 2);
      ctx.shadowBlur = 0;
    } else {
      ctx.fillRect(part.x * size + 1, part.y * size + 1, size - 2, size - 2);
    }
  });
}

function placeFood() {
  if (snake.length === tileCount * tileCount) {
    endGame(You