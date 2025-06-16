/**
 * Manages the overall game lifecycle, including start, pause, resume, game over, and victory handling.
 * Handles visibility of game screens, world control, and sound coordination.
 */
class GameManager {
  /**
   * Creates a new GameManager.
   * @param {World} world - The initial game world instance.
   */
  constructor(world) {
    /** @type {World} */
    this.world = world;

    /** @type {SoundManager} */
    this.soundManager = soundManager;

    /** @type {boolean} */
    this.isGameRunning = false;

    /** @type {boolean} */
    this.isPaused = false;

    /** @type {boolean} */
    this.isGameOver = false;

    /** @type {HTMLElement} */
    this.gameOverScreen = document.getElementById("game-over-screen");

    /** @type {HTMLElement} */
    this.startScreen = document.getElementById("start-screen");

    /** @type {HTMLCanvasElement} */
    this.canvas = document.getElementById("canvas");
  }

  /**
   * Starts the game: hides UI, initializes world, and plays background music.
   */
  startGame() {
    this.isGameRunning = true;
    this.isPaused = false;
    if (this.startScreen) this.startScreen.style.display = "none";
    if (this.gameOverScreen) this.gameOverScreen.classList.add("hidden");
    if (this.canvas) this.canvas.style.display = "block";
    this.world.setBackgroundObjects(level1.backgroundObjects);
    this.world?.run();
    this.soundManager?.play("backgroundMusic");
  }

  /**
   * Stops the game loop and sounds, and removes keyboard listeners.
   */
  stopGame() {
    if (!this.isGameRunning) return;
    this.isGameRunning = false;
    this.soundManager?.stopAll();
    this.world?.character?.stop?.();
    this.world?.endboss?.stop?.();
    this.world?.stopObjects?.();
    this.world?.stopGameLoop?.();
    window.removeEventListener("keydown", handleKeyDown);
  }

  /**
   * Displays the start screen and hides game canvas.
   */
  showStartScreen() {
    hideGameOverScreen();
    if (this.startScreen) {
      this.startScreen.classList.add("visible");
      this.startScreen.classList.remove("hidden");
      this.startScreen.style.display = "flex";
    }
    if (this.canvas) {
      this.canvas.style.opacity = 1;
      this.canvas.style.display = "none";
    }
  }

  /**
   * Displays the end screen with a win or lose message.
   * @param {boolean} [won=false] - Whether the player won the game.
   */
  showEndScreen(won = false) {
    const screen = this.gameOverScreen;
    const textImg = document.getElementById("game-over-image");

    textImg.src = won
      ? "img/You won, you lost/You Win A.png"
      : "img/You won, you lost/Game over A.png";

    screen.classList.remove("hidden");
    screen.style.zIndex = "1000";
    this.canvas.style.opacity = 0.2;
    setTimeout(() => screen.classList.add("visible"), 800);
  }

  /**
   * Triggers game over logic, sound, and screen.
   */
  gameOver() {
    this.isGameRunning = false;
    this.isGameOver = true;
    this.world?.stopGameLoop?.();

    setTimeout(() => this.soundManager?.play("gameOver"), 100);
    this.showEndScreen(false);
    this.soundManager?.stopAll();
  }

  /**
   * Triggers win logic, sound, and victory screen.
   */
  gameWon() {
    this.isGameRunning = false;
    this.world?.stopGameLoop?.();

    setTimeout(() => this.soundManager?.play("gameWon"), 50);
    this.showEndScreen(true);
    this.soundManager?.stopAll();
  }

  /**
   * Toggles between paused and unpaused game state.
   */
  togglePause() {
    if (!this.isGameRunning) return;
    this.isPaused ? this.resumeGame() : this.pauseGame();
  }

  /**
   * Pauses the game and sound.
   */
  pauseGame() {
    if (!this.isGameRunning) return;
    this.isPaused = true;
    this.world?.pauseObjects?.();
    this.soundManager?.pauseAll?.();
  }

  /**
   * Resumes the game and sound after a pause.
   */
  resumeGame() {
    if (!this.isGameRunning) return;
    this.isPaused = false;
    this.world?.resumeObjects?.();
    this.soundManager?.resumeAll?.();
  }

  /**
   * Restarts the game: resets state, world, and starts a new session.
   */
  restartGame() {
    this.pauseAndResetState();
    this.clearWorld();
    this.startNewGame();
  }

  /**
   * Stops sounds and resets keyboard/game state.
   */
  pauseAndResetState() {
    this.soundManager?.stopAll();
    this.stopGame();
    keyboard.reset();
  }

  /**
   * Clears the current world and resets UI.
   */
  clearWorld() {
    this.world?.character?.stop?.();
    this.world?.endboss?.stop?.();
    this.world?.stopGameLoop?.();
    this.world = null;
    hideGameOverScreen();
    this.canvas.style.opacity = 1;
  }

  /**
   * Initializes and starts a fresh game session.
   */
  startNewGame() {
    initLevel();
    this.world = new World(this.canvas, keyboard, level1, this);
    this.world.soundManager = this.soundManager;
    this.world.gameManager = this;
    this.startGame();
  }
}
