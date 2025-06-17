/**
 * Global variables for the canvas, game world, current level, and game manager.
 */
let canvas, world, level, gameManager;
const keyboard = new Keyboard();
const buttons = {};
let spaceListenerAdded = false;

/**
 * Initializes the game when DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  cacheButtons();
  initializeSoundManager();
  setupStartButton();
  initializeEventListeners();
  setupEventListeners();
});

/**
 * Caches important button elements by their IDs for later use.
 */
function cacheButtons() {
  buttons.start = document.getElementById("start-button");
  buttons.pause = document.getElementById("pause-btn");
  buttons.resume = document.getElementById("resume-btn");
  buttons.restart = document.getElementById("restart-btn");
  buttons.menu = document.getElementById("menu-btn");
  buttons.learn = document.getElementById("learn-button");
}

/**
 * Sets up the start button click event to start the game.
 */
function setupStartButton() {
  if (!buttons.start) return;
  buttons.start.addEventListener("click", async () => {
    showLoading(true);
    await preloadImages(layerSets.flat());
    showLoading(false);
    if (!level1) initLevel(); 
    initializeGameManager();

    const bgObjects = generateBackgroundObjects(layerSets);
    world.setBackgroundObjects(bgObjects);
    gameManager.startGame();
  });
}

/**
 * Initializes the game manager, world, and canvas context.
 */
function initializeGameManager() {
  if (world && typeof world.cleanup === "function") world.cleanup();
  if (gameManager && typeof gameManager.cleanup === "function") gameManager.cleanup();

  canvas = document.getElementById("canvas");
  if (!canvas) return console.error("Canvas not found");
  level = level1;
  soundManager ??= new SoundManager();
  gameManager = new GameManager(null);

  world = new World(canvas, keyboard, level, gameManager);
  world.soundManager = soundManager;
  gameManager.world = world;

  addPauseToggleWithSpace();
}

/**
 * Helper to add a click event listener to a button if it exists.
 */
function addButtonListener(btn, handler) {
  if (btn) btn.addEventListener("click", handler);
}

/**
 * Sets up all button event listeners using a mapping.
 */
function setupButtonListeners() {
  const buttonMap = [
    { btn: buttons.pause, handler: handlePause },
    { btn: buttons.resume, handler: handleResume },
    { btn: buttons.learn, handler: showInstructions },
    { btn: buttons.restart, handler: () => gameManager?.restartGame() },
    {
      btn: buttons.menu,
      handler: () => {
        gameManager.showStartScreen();
      },
    },
  ];
  buttonMap.forEach(({ btn, handler }) => addButtonListener(btn, handler));
  initializeImpressum();
}

/**
 * Initializes all relevant event listeners for buttons and window events.
 */
function initializeEventListeners() {
  setupButtonListeners();
}

/**
 * Adds an event listener for the space bar key to toggle game pause/resume.
 */
function addPauseToggleWithSpace() {
  if (spaceListenerAdded) return;
  spaceListenerAdded = true;

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !e.repeat && gameManager?.isGameRunning) {
      e.preventDefault();
      toggleSoundForPauseState();
      gameManager.togglePause();
    }
  });
}

/**
 * Sets up window event listeners for keyboard and orientation.
 */
function setupEventListeners() {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
  window.removeEventListener("resize", checkOrientation);
  window.removeEventListener("load", checkOrientation);

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("load", checkOrientation);
}

/**
 * Handles the pause button click to pause the game and update button visibility.
 */
function handlePause() {
  if (!gameManager) return;
  gameManager.pauseGame();
  soundManager?.pauseAll();
  togglePauseResumeButtons(true);
}

/**
 * Handles the resume button click to resume the game and update button visibility.
 */
function handleResume() {
  if (!gameManager) return;
  gameManager.resumeGame();
  soundManager?.resumeAll();
  togglePauseResumeButtons(false);
}

/**
 * Toggles visibility of pause and resume buttons based on pause state.
 */
function togglePauseResumeButtons(isPaused) {
  if (!buttons.pause || !buttons.resume) return;
  buttons.pause.style.display = isPaused ? "none" : "inline-block";
  buttons.resume.style.display = isPaused ? "inline-block" : "none";
}

/**
 * Handles keydown events to update keyboard state flags.
 */
function handleKeyDown(e) {
  if (!gameManager || !gameManager.isGameRunning) return;
  const key = e.key.toLowerCase();
  if (key === "arrowright") keyboard.RIGHT = true;
  if (key === "arrowleft") keyboard.LEFT = true;
  if (key === "arrowup") keyboard.UP = true;
  if (key === "arrowdown") keyboard.DOWN = true;
  if (key === " ") keyboard.SPACE = true;
  if (key === "d") keyboard.D = true;
}

/**
 * Handles keyup events to update keyboard state flags.
 */
function handleKeyUp(e) {
  const key = e.key.toLowerCase();
  if (key === "arrowright") keyboard.RIGHT = false;
  if (key === "arrowleft") keyboard.LEFT = false;
  if (key === "arrowup") keyboard.UP = false;
  if (key === "arrowdown") keyboard.DOWN = false;
  if (key === " ") keyboard.SPACE = false;
  if (key === "d") keyboard.D = false;
}

/**
 * Hides the game over screen by changing its CSS classes.
 */
function hideGameOverScreen() {
  const screen = document.getElementById("game-over-screen");
  if (screen) {
    screen.classList.remove("visible");
    screen.classList.add("hidden");
  }
}

/**
 * Shows the loading screen.
 */
function showLoading(visible) {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) loadingScreen.style.display = visible ? "block" : "none";
}

/**
 * Preloads an array of image paths.
 */
async function preloadImages(paths) {
  await Promise.all(
    paths.map(
      (path) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = path;
          img.onload = resolve;
          img.onerror = () => {
            console.warn("Error loading:", path);
            resolve();
          };
        })
    )
  );
}

/**
 * Toggles all sounds based on the current pause state of the game.
 */
function toggleSoundForPauseState() {
  const isPaused = gameManager.isPaused;
  if (isPaused) {
    soundManager.resumeAll();
  } else {
    soundManager.pauseAll();
  }
}
