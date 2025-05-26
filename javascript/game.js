let canvas;
let world;
let keyboard = new Keyboard();
let level;
let gameManager;

// preload mit async/await
async function preloadImages(paths) {
  await Promise.all(
    paths.map(
      (path) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = path;
          img.onload = () => resolve();
          img.onerror = () => {
            console.warn("Fehler beim Laden:", path);
            resolve();
          };
        })
    )
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");

  initializeSoundManager();

  startButton.addEventListener("click", async () => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) loadingScreen.style.display = "block";

    // Alle Pfade aus layerSets extrahieren und preloaden
    const preloadPaths = layerSets.flat();
    await preloadImages(preloadPaths);

    if (loadingScreen) loadingScreen.style.display = "none";

    // Level & Manager initialisieren
    if (!level1) initLevel();
    if (!gameManager) initializeGameManager();

    // Hintergrundobjekte generieren und übergeben
    const bgObjects = generateBackgroundObjects(layerSets);
    world.setBackgroundObjects(bgObjects);

    // Spiel starten
    gameManager.startGame();
  });

  initializeEventListeners();
  console.log("Aktive Sounds:", soundManager.sounds);
});

// Initialisiere den GameManager
function initializeGameManager() {
  canvas = document.getElementById("canvas");
  if (!canvas) console.error("Canvas element not found!");
  if (!level) level = level1;
  if (!soundManager) soundManager = new SoundManager();

  keyboard = new Keyboard(); // Initialisiere die Tastatur nur einmal
  world = new World(canvas, keyboard, level1); // Erstelle eine World-Instanz
  world.soundManager = soundManager; // Verknüpfe den SoundManager mit der Welt
  gameManager = new GameManager(world); // Verknüpfe die World mit dem GameManager
  world.gameManager = gameManager; // Verknüpfung in beide Richtungen sicherstellen

  initializePauseToggleEvent();
}

function initializePauseToggleEvent() {
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && gameManager && gameManager.isGameRunning) {
      gameManager.togglePause();
    }
  });
}

/// Funktion zum Initialisieren der Pause-Events
function initializePauseEvents() {
  const pauseButton = document.getElementById("pause-btn");
  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      if (gameManager) {
        gameManager.pauseGame();
        togglePauseResumeButtons(true);
      } else {
        console.error("GameManager is not initialized!");
      }
    });
  }
}

// Funktion zum Initialisieren der Resume-Events
function initializeResumeEvents() {
  const resumeButton = document.getElementById("resume-btn");
  if (resumeButton) {
    resumeButton.addEventListener("click", () => {
      if (gameManager) {
        gameManager.resumeGame();
        togglePauseResumeButtons(false);
      }
    });
  }
}
// Hilfsfunktion, um Buttons zu toggeln
function togglePauseResumeButtons(isPaused) {
  const pauseButton = document.getElementById("pause-btn");
  const resumeButton = document.getElementById("resume-btn");

  if (pauseButton && resumeButton) {
    if (isPaused) {
      pauseButton.style.display = "none";
      resumeButton.style.display = "inline-block"; // oder block, je nach Layout
    } else {
      pauseButton.style.display = "inline-block";
      resumeButton.style.display = "none";
    }
  }
}

// Hauptfunktion zur Initialisierung aller Event Listener
function initializeEventListeners() {
  const restartButton = document.getElementById("restart-button");
  if (restartButton) restartButton.addEventListener("click", restartGame);

  const learnButton = document.getElementById("learn-button");
  if (learnButton) learnButton.addEventListener("click", showInstructions);

  initializePauseEvents();
  initializeResumeEvents();
  initializeImpressum();

  // Globale Tastatureingaben initialisieren
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}

// Funktion für Keydown-Event
function handleKeyDown(e) {
  if (e.key === "ArrowRight") keyboard.RIGHT = true;
  if (e.key === "ArrowLeft") keyboard.LEFT = true;
  if (e.key === "ArrowUp") keyboard.UP = true;
  if (e.key === "ArrowDown") keyboard.DOWN = true;
  if (e.key === " ") keyboard.SPACE = true;
  if (e.key === "d" || e.key === "D") keyboard.D = true;
}

function handleKeyUp(e) {
  if (e.key === "ArrowRight") keyboard.RIGHT = false;
  if (e.key === "ArrowLeft") keyboard.LEFT = false;
  if (e.key === "ArrowUp") keyboard.UP = false;
  if (e.key === "ArrowDown") keyboard.DOWN = false;
  if (e.key === " ") keyboard.SPACE = false;
  if (e.key === "d" || e.key === "D") keyboard.D = false;
}

function restartGame() {
  console.log("Spiel wird neu gestartet...");

  if (gameManager) {
    // Stoppe altes Spiel
    gameManager.stopGame();

    // Entferne Game-Over-Screen (inkl. Sichtbarkeit & Reset von CSS)
    const screen = document.getElementById("game-over-screen");
    if (screen) {
      screen.classList.remove("visible");
      screen.classList.add("hidden");
    }

    // Setze Canvas wieder sichtbar
    if (canvas) {
      canvas.style.opacity = 1;
    }

    // Erstelle neuen Level (wenn du das möchtest – optional!)
    initLevel();

    // Erstelle neue World (bzw. World zurücksetzen)
    world = new World(canvas, keyboard, level1);
    world.soundManager = soundManager;

    // Aktualisiere gameManager mit neuer World
    gameManager = new GameManager(world);
    world.gameManager = gameManager;

    gameManager.startGame();
  } else {
    console.warn("Kein GameManager zum Neustarten vorhanden!");
  }
}
