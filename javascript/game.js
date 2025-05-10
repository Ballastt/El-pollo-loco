let canvas;
let world;
let keyboard = new Keyboard();
let level;

document.addEventListener("DOMContentLoaded", () => {
  // Hole den Start-Button
  const startButton = document.getElementById("start-button");

  // Füge den Klick-Event-Listener hinzu
  startButton.addEventListener("click", startGame);
});

// Funktion, die das Spiel startet
function startGame() {
  // Verstecke den Startbildschirm
  const startScreen = document.getElementById("start-screen");
  startScreen.style.display = "none";

  // Zeige das Canvas an
  const canvas = document.getElementById("canvas");
  canvas.style.display = "block";

  // Initialisiere das Spiel
  initGame();
}

function initGame() {
  canvas = document.getElementById("canvas");
  keyboard = new Keyboard();

  level = level1;

  level.regenerateEnemies();

  world = new World(canvas, keyboard, level);

  console.log("my character is", world.character);
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

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    keyboard.RIGHT = true;
  }
  if (e.key === "ArrowLeft") {
    keyboard.LEFT = true;
  }
  if (e.key === "ArrowUp") {
    keyboard.UP = true;
  }
  if (e.key === "ArrowDown") {
    keyboard.DOWN = true;
  }
  if (e.key === " ") {
    keyboard.SPACE = true;
    console.log("SPACE pressed", keyboard);
  }
  if (e.key === "d" || e.key === "D") {
    // Taste D hinzufügen
    keyboard.D = true;
    console.log("D pressed", keyboard);
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") {
    keyboard.RIGHT = false;
  }
  if (e.key === "ArrowLeft") {
    keyboard.LEFT = false;
  }
  if (e.key === "ArrowUp") {
    keyboard.UP = false;
  }
  if (e.key === "ArrowDown") {
    keyboard.DOWN = false;
  }
  if (e.key === " ") {
    keyboard.SPACE = false;
    console.log("SPACE released", keyboard);
  }
  if (e.key === "d" || e.key === "D") {
    // Taste D hinzufügen
    keyboard.D = false;
    console.log("D released", keyboard);
  }
});
