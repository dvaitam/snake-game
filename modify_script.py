import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Add fruits array
if "const fruits =" not in content:
    content = content.replace(
        "const tileCount = canvas.width / size;",
        "const tileCount = canvas.width / size;\nconst fruits = ['🍎', '🍊', '🍋', '🍉', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝'];"
    )

# 2. Modify food initialization
content = content.replace(
    "let food = {x: 15, y: 15};",
    "let food = {x: 15, y: 15, emoji: '🍎'};"
)

# 3. Remove foodHue variable
content = content.replace("let foodHue = 0;\n", "")

# 4. Modify placeFood function
place_food_original = """function placeFood() {
  if (snake.length === tileCount * tileCount) {
    endGame('You Win! 🎉');
    return;
  }
  do {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}"""
place_food_new = """function placeFood() {
  if (snake.length === tileCount * tileCount) {
    endGame('You Win! 🎉');
    return;
  }
  food.emoji = fruits[Math.floor(Math.random() * fruits.length)];
  do {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}"""
content = content.replace(place_food_original, place_food_new)

# 5. Modify draw function
draw_food_original = """  // Draw food with glow effect
  ctx.shadowColor = `hsl(${foodHue}, 100%, 50%)`;
  ctx.shadowBlur = 15;
  ctx.fillStyle = `hsl(${foodHue}, 100%, 50%)`;
  ctx.fillRect(food.x * size, food.y * size, size, size);
  ctx.shadowBlur = 0;
  foodHue = (foodHue + 4) % 360;"""
draw_food_new = """  // Draw food
  ctx.font = `${size}px Arial`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(food.emoji, food.x * size + size / 2, food.y * size + size / 2);"""
content = content.replace(draw_food_original, draw_food_new)

with open('script.js', 'w') as f:
    f.write(content)

