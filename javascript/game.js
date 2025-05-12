let canvas;
let world;
let keyboard = new Keyboard();
let level;

document.addEventListener("DOMContentLoaded", () => {
  // Hole den Start-Button
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", () => {
    gameManager.startGame();
  });

  initializeEventListeners();
  initializeGameManager();
});

// Initialisiere den GameManager
function initializeGameManager() {
  canvas = document.getElementById("canvas");
  level = level1;
  world = new World(canvas, keyboard, level);
  gameManager = new GameManager(world); // GameManager-Instanz erstellen
}

function initGame() {
  canvas = document.getElementById("canvas");
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
}

// Funktion für Keydown-Event
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

function restartGame() {
  console.log("Spiel wird neu gestartet...");
  if (gameManager) {
    gameManager.startGame(); // Neustart über den GameManager
  }
}
