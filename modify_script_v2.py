import re

with open('script.js', 'r') as f:
    content = f.read()

# Add fruits array
content = re.sub(
    r"(const tileCount = canvas.width / size;)",
    r"\1\nconst fruits = ['🍎', '🍊', '🍋', '🍉', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝'];",
    content
)

# Modify food initialization
content = re.sub(
    r"let food = {x: 15, y: 15};",
    r"let food = {x: 15, y: 15, emoji: '🍎'};",
    content
)

# Remove foodHue variable
content = re.sub(
    r"let foodHue = 0;\n",
    "",
    content
)

# Modify placeFood function to select a random fruit
place_food_pattern = re.compile(r"(function placeFood\(\) \{)(.*?)(\})", re.DOTALL)
place_food_new_body = r"""
  if (snake.length === tileCount * tileCount) {
    endGame('You Win! 🎉');
    return;
  }
  food.emoji = fruits[Math.floor(Math.random() * fruits.length)];
  do {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
  } while (snake.some(s => s.x === food.x && s.y === food.y));
"""
# Use a function for replacement to avoid issues with backslashes in the replacement string
def replace_place_food(m):
    return m.group(1) + place_food_new_body + m.group(3)

content = place_food_pattern.sub(replace_place_food, content, 1)


# Modify draw function to draw fruit emoji instead of a square
draw_food_pattern = re.compile(r"// Draw food with glow effect.*?foodHue = \(foodHue \+ 4\) % 360;", re.DOTALL)
draw_food_new_code = r"""  // Draw food
  ctx.font = `${size}px Arial`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(food.emoji, food.x * size + size / 2, food.y * size + size / 2);"""
content = draw_food_pattern.sub(draw_food_new_code, content)


with open('script.js', 'w') as f:
    f.write(content)

