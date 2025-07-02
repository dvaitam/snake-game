const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const size = 20;
const tileCount = canvas.width / size;
let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
let food = {x: 15, y: 15};
let speed = 8;
let gameOver = false;
let lastTime = 0;
let foodHue = 0;

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
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    placeFood();
  } else {
    snake.pop();
  }
  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.slice(1).some(s => s.x === head.x && s.y === head.y)
  ) {
    endGame();
  }
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = `hsl(${foodHue}, 100%, 50%)`;
  ctx.fillRect(food.x * size, food.y * size, size, size);
  foodHue = (foodHue + 4) % 360;
  ctx.fillStyle = '#0f0';
  snake.forEach(part => {
    ctx.fillRect(part.x * size, part.y * size, size - 1, size - 1);
  });
}

function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

function endGame() {
  gameOver = true;
  const over = document.getElementById('game-over');
  over.classList.remove('hidden');
  setTimeout(() => over.classList.add('show'), 10);
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' && direction.x !== 1) direction = {x: -1, y: 0};
  if (e.key === 'ArrowUp' && direction.y !== 1) direction = {x: 0, y: -1};
  if (e.key === 'ArrowRight' && direction.x !== -1) direction = {x: 1, y: 0};
  if (e.key === 'ArrowDown' && direction.y !== -1) direction = {x: 0, y: 1};
});

document.getElementById('restart').addEventListener('click', () => {
  snake = [{x: 10, y: 10}];
  direction = {x: 0, y: 0};
  placeFood();
  gameOver = false;
  const over = document.getElementById('game-over');
  over.classList.remove('show');
  setTimeout(() => over.classList.add('hidden'), 600);
  requestAnimationFrame(gameLoop);
});

placeFood();
requestAnimationFrame(gameLoop);
