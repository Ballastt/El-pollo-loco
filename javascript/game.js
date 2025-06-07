/**
 * Global variables for the canvas, game world, current level, and game manager.
 * @type {HTMLCanvasElement|undefined}
 */
let canvas, world, level, gameManager;

/**
 * Instance of Keyboard class to track key states.
 * @type {Keyboard}
 */
const keyboard = new Keyboard();

/**
 * Object to cache frequently used DOM button elements.
 * @type {Object.<string, HTMLElement|null>}
 */
const buttons = {};

let spaceListenerAdded = false;

/**
 * Initializes the game when DOM content is fully loaded:
 * - Caches buttons.
 * - Initializes sound manager.
 * - Sets up the start button.
 * - Attaches event listeners.
 * - Logs currently active sounds.
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
  buttons.restart = document.getElementById("restart-button");
  buttons.learn = document.getElementById("learn-button");
}

/**
 * Sets up the start button click event to:
 * - Show a loading screen.
 * - Preload required images.
 * - Initialize level and game manager if needed.
 * - Generate and set background objects.
 * - Start the game.
 */
function setupStartButton() {
  if (!buttons.start) return;
  buttons.start.addEventListener("click", async () => {
    showLoading(true);
    await preloadImages(layerSets.flat());
    showLoading(false);
    if (!level1) initLevel();
    initializeGameManager(); // <- Immer aufrufen
    console.log("✅ GameManager initialisiert:", gameManager);

    const bgObjects = generateBackgroundObjects(layerSets);
    world.setBackgroundObjects(bgObjects);
    gameManager.startGame();
  });
}

/**
 * Toggles the loading screen visibility.
 * @param {boolean} visible - Whether to show or hide the loading screen.
 */
function showLoading(visible) {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) loadingScreen.style.display = visible ? "block" : "none";
}

/**
 * Preloads an array of image paths.
 * @param {string[]} paths - Array of image URLs to preload.
 * @returns {Promise<void>} Resolves when all images are loaded or errored.
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
 * Initializes the game manager, world, and canvas context.
 * Also adds keyboard listener for pausing with space bar.
 */
function initializeGameManager() {
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
 * Adds an event listener for the space bar key to toggle game pause/resume.
 */
function addPauseToggleWithSpace() {
  if (spaceListenerAdded) return;
  spaceListenerAdded = true;

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !e.repeat && gameManager?.isGameRunning) {
      e.preventDefault(); // ✅ verhindert Scrollen bei Space
      console.log("▶️ SPACE gedrückt");
      gameManager.togglePause();
    }
  });
}

/**
 * Initializes all relevant event listeners for buttons and window events.
 */
function initializeEventListeners() {
  buttons.restart = document.getElementById("restart-btn");
  if (buttons.pause) buttons.pause.addEventListener("click", handlePause);
  if (buttons.resume) buttons.resume.addEventListener("click", handleResume);

  if (buttons.restart) {
    buttons.restart.addEventListener("click", () => {
      if (gameManager) {
        gameManager.restartGame();
      } else {
        console.warn("GameManager not initialized yet");
      }
    });
  }
  if (buttons.learn) buttons.learn.addEventListener("click", showInstructions);

  initializeImpressum();
}

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
  togglePauseResumeButtons(true);
}

/**
 * Handles the resume button click to resume the game and update button visibility.
 */
function handleResume() {
  if (!gameManager) return;
  gameManager.resumeGame();
  togglePauseResumeButtons(false);
}

/**
 * Toggles visibility of pause and resume buttons based on pause state.
 * @param {boolean} isPaused - True if game is paused, false otherwise.
 */
function togglePauseResumeButtons(isPaused) {
  if (!buttons.pause || !buttons.resume) return;
  buttons.pause.style.display = isPaused ? "none" : "inline-block";
  buttons.resume.style.display = isPaused ? "inline-block" : "none";
}

/**
 * Handles keydown events to update keyboard state flags.
 * @param {KeyboardEvent} e - The keyboard event.
 */
function handleKeyDown(e) {
  console.log(gameManager, "* gameManager");
  // Check if gameManager exists and the game is running
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
 * @param {KeyboardEvent} e - The keyboard event.
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
 * Checks device orientation and shows an overlay if in portrait mode.
 */
function checkOrientation() {
  const overlay = document.getElementById("rotate-device-overlay");
  if (!overlay) return;
  overlay.style.display =
    window.innerHeight > window.innerWidth ? "flex" : "none";
}
