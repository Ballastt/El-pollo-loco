let canvas;
let world;
let keyboard = new Keyboard();
let level;

document.addEventListener("DOMContentLoaded", () => {
  // Hole den Start-Button
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", startGame);
  initializeEventListeners();
});

// Funktion, die das Spiel startet
function startGame() {
  // Verstecke den Startbildschirm
  const startScreen = document.getElementById("start-screen");
  startScreen.style.display = "none";

   // Verstecke den Game-Over-Screen
  const gameOverScreen = document.getElementById("game-over-screen");
  if (gameOverScreen) gameOverScreen.classList.add("hidden");
  
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

  world = new World(canvas, keyboard, level); // Hier wird die World-Klasse instanziert

  const gameManager = new GameManager(world); // Hier wird der GameManager instanziert
  world.gameManager = gameManager; // Hier wird die Instanz des GameManagers an die World-Klasse übergeben

  console.log("Spiel erfolgreich initialisiert");
  console.log("my character is", world.character);
}

// Funktion, um Spielanweisungen zu zeigen
function showInstructions() {
  alert(
    "Welcome to the game! Here are the instructions:\n\n" +
      "- Use arrow keys to move.\n" +
      "- Avoid enemies and collect items.\n" +
      "- Have fun!"
  );
}

// Funktion, um Event Listener zu bündeln
function initializeEventListeners() {
  const restartButton = document.getElementById("restart-button");
  if (restartButton) restartButton.addEventListener("click", restartGame);

  const learnButton = document.getElementById("learn-button");
  if (learnButton) learnButton.addEventListener("click", showInstructions);

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}

// Funktion für Keydown-Event
function handleKeyDown(e) {
  switch (e.key) {
    case "ArrowRight":
      keyboard.RIGHT = true;
      break;
    case "ArrowLeft":
      keyboard.LEFT = true;
      break;
    case "ArrowUp":
      keyboard.UP = true;
      break;
    case "ArrowDown":
      keyboard.DOWN = true;
      break;
    case " ":
      keyboard.SPACE = true;
      console.log("SPACE pressed", keyboard);
      break;
    case "d":
    case "D":
      keyboard.D = true;
      console.log("D pressed", keyboard);
      break;
  }
}

// Funktion für Keyup-Event
function handleKeyUp(e) {
  switch (e.key) {
    case "ArrowRight":
      keyboard.RIGHT = false;
      break;
    case "ArrowLeft":
      keyboard.LEFT = false;
      break;
    case "ArrowUp":
      keyboard.UP = false;
      break;
    case "ArrowDown":
      keyboard.DOWN = false;
      break;
    case " ":
      keyboard.SPACE = false;
      console.log("SPACE released", keyboard);
      break;
    case "d":
    case "D":
      keyboard.D = false;
      console.log("D released", keyboard);
      break;
  }
}

function restartGame() {
  // Verstecke den Game-Over-Screen
  const gameOverScreen = document.getElementById("game-over-screen");
  console.log("Game Over Screen Klassen:", gameOverScreen.classList);
  console.log(
    "Game Over Screen Style:",
    window.getComputedStyle(gameOverScreen).display
  );
  if (gameOverScreen) gameOverScreen.classList.add("hidden");

  // Starte das Spiel neu
  initGame();
}
