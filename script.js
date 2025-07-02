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
    placeFood();
  } else {
    snake.pop();
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
  if (snake.length === tileCount * tileCount) {
    endGame('You win!');
    return;
  }
  do {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function endGame(message = 'Game Over') {
  gameOver = true;
  const over = document.getElementById('game-over');
  over.querySelector('p').textContent = message;

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
  over.querySelector('p').textContent = 'Game Over';

  over.classList.remove('show');
  setTimeout(() => over.classList.add('hidden'), 600);
  requestAnimationFrame(gameLoop);
});

placeFood();
requestAnimationFrame(gameLoop);
