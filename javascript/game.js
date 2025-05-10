let canvas;
let world;
let keyboard = new Keyboard();
let level;

function init() {
    canvas = document.getElementById('canvas');
    keyboard = new Keyboard();
    world = new World(canvas, keyboard);

    console.log("my character is", world.character);    
}


// Function to start the game
function startGame() {
  startScreen.style.display = "none";

  // Start the game logic (your existing game code)
  initializeGame();
}

// Placeholder for game initialization
function initializeGame() {
  console.log("Game starts here!");
  // Add your game logic here (e.g., create the World instance and start the game loop)
}


// Function to show game instructions
function showInstructions() {
  alert(
    "Welcome to the game! Here are the instructions:\n\n" +
    "- Use arrow keys to move.\n" +
    "- Avoid enemies and collect items.\n" +
    "- Have fun!"
  );
}

// Event Listener for Learn Button
learnButton.addEventListener("click", showInstructions);
startButton.addEventListener("click", startGame);

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        keyboard.RIGHT = true;
    }
    if (e.key === 'ArrowLeft') {
        keyboard.LEFT = true;
    }
    if (e.key === 'ArrowUp') {
        keyboard.UP = true;
    }
    if (e.key === 'ArrowDown') {
        keyboard.DOWN = true;
    }
    if (e.key === ' ') {
        keyboard.SPACE = true;
        console.log('SPACE pressed', keyboard);
    }
    if (e.key === 'd' || e.key === 'D') { // Taste D hinzufügen
        keyboard.D = true;
        console.log('D pressed', keyboard);
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') {
        keyboard.RIGHT = false;
    }
    if (e.key === 'ArrowLeft') {
        keyboard.LEFT = false;
    }
    if (e.key === 'ArrowUp') {
        keyboard.UP = false;
    }
    if (e.key === 'ArrowDown') {
        keyboard.DOWN = false;
    }
    if (e.key === ' ') {
        keyboard.SPACE = false;
        console.log('SPACE released', keyboard);
    }
    if (e.key === 'd' || e.key === 'D') { // Taste D hinzufügen
        keyboard.D = false;
        console.log('D released', keyboard);
    }
});
