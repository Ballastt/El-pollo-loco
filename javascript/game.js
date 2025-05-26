let canvas, world, level, gameManager;
const keyboard = new Keyboard();
const buttons = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheButtons();
  initializeSoundManager();
  setupStartButton();
  initializeEventListeners();
  console.log("Aktive Sounds:", soundManager?.sounds || "Keine Sounddaten");
});

function cacheButtons() {
  buttons.start = document.getElementById("start-button");
  buttons.pause = document.getElementById("pause-btn");
  buttons.resume = document.getElementById("resume-btn");
  buttons.restart = document.getElementById("restart-button");
  buttons.learn = document.getElementById("learn-button");
}

function setupStartButton() {
  if (!buttons.start) return;
  buttons.start.addEventListener("click", async () => {
    showLoading(true);
    await preloadImages(layerSets.flat());
    showLoading(false);
    if (!level1) initLevel();
    if (!gameManager) initializeGameManager();
    const bgObjects = generateBackgroundObjects(layerSets);
    world.setBackgroundObjects(bgObjects);
    gameManager.startGame();
  });
}

function showLoading(visible) {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) loadingScreen.style.display = visible ? "block" : "none";
}

async function preloadImages(paths) {
  await Promise.all(
    paths.map(
      (path) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = path;
          img.onload = resolve;
          img.onerror = () => {
            console.warn("Fehler beim Laden:", path);
            resolve();
          };
        })
    )
  );
}

function initializeGameManager() {
  canvas = document.getElementById("canvas");
  if (!canvas) return console.error("Canvas nicht gefunden");
  level = level1;
  soundManager ??= new SoundManager();
  world = new World(canvas, keyboard, level);
  world.soundManager = soundManager;
  gameManager = new GameManager(world);
  world.gameManager = gameManager;
  addPauseToggleWithSpace();
}

function addPauseToggleWithSpace() {
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && gameManager?.isGameRunning) {
      gameManager.togglePause();
    }
  });
}

function initializeEventListeners() {
  if (buttons.pause) buttons.pause.addEventListener("click", handlePause);
  if (buttons.resume) buttons.resume.addEventListener("click", handleResume);
  if (buttons.restart) buttons.restart.addEventListener("click", restartGame);
  if (buttons.learn) buttons.learn.addEventListener("click", showInstructions);

  initializeImpressum();
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("load", checkOrientation);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}

function handlePause() {
  if (!gameManager) return;
  gameManager.pauseGame();
  togglePauseResumeButtons(true);
}

function handleResume() {
  if (!gameManager) return;
  gameManager.resumeGame();
  togglePauseResumeButtons(false);
}

function togglePauseResumeButtons(isPaused) {
  if (!buttons.pause || !buttons.resume) return;
  buttons.pause.style.display = isPaused ? "none" : "inline-block";
  buttons.resume.style.display = isPaused ? "inline-block" : "none";
}

function handleKeyDown(e) {
  const key = e.key.toLowerCase();
  if (key === "arrowright") keyboard.RIGHT = true;
  if (key === "arrowleft") keyboard.LEFT = true;
  if (key === "arrowup") keyboard.UP = true;
  if (key === "arrowdown") keyboard.DOWN = true;
  if (key === " ") keyboard.SPACE = true;
  if (key === "d") keyboard.D = true;
}

function handleKeyUp(e) {
  const key = e.key.toLowerCase();
  if (key === "arrowright") keyboard.RIGHT = false;
  if (key === "arrowleft") keyboard.LEFT = false;
  if (key === "arrowup") keyboard.UP = false;
  if (key === "arrowdown") keyboard.DOWN = false;
  if (key === " ") keyboard.SPACE = false;
  if (key === "d") keyboard.D = false;
}

function restartGame() {
  gameManager?.stopGame();
  hideGameOverScreen();
  if (canvas) canvas.style.opacity = 1;
  initLevel();
  world = new World(canvas, keyboard, level1);
  world.soundManager = soundManager;
  gameManager = new GameManager(world);
  world.gameManager = gameManager;
  gameManager.startGame();
}

function hideGameOverScreen() {
  const screen = document.getElementById("game-over-screen");
  if (screen) {
    screen.classList.remove("visible");
    screen.classList.add("hidden");
  }
}

function checkOrientation() {
  const overlay = document.getElementById("rotate-device-overlay");
  if (!overlay) return;
  overlay.style.display =
    window.innerHeight > window.innerWidth ? "flex" : "none";
}
