let canvas;
let world;
let keyboard = new Keyboard();
let level;
let gameManager;

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");

  startButton.addEventListener("click", () => {
    // Stelle sicher, dass level1 erst erstellt wird, wenn das Spiel startet
  
    if (!gameManager) {
      initializeGameManager();
    }

    gameManager.startGame();
  });

  initializeEventListeners();
});

// Initialisiere den GameManager
function initializeGameManager() {
  canvas = document.getElementById("canvas");
  if (!level) level = level1;
  keyboard = new Keyboard(); // Initialisiere die Tastatur nur einmal
  world = new World(canvas, keyboard, level); // Erstelle eine World-Instanz
  gameManager = new GameManager(world); // Verknüpfe die World mit dem GameManager
  world.gameManager = gameManager; // Verknüpfung in beide Richtungen sicherstellen

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
