/**
 * Manages the overall game state, screens, and game flow.
 * Handles starting, stopping, pausing, resuming, and restarting the game.
 */
class GameManager {
  /**
   * Creates a new GameManager instance.
   * @param {World} world - The game world instance.
   */
  constructor(world) {
    /**
     * Reference to the game world.
     * @type {World}
     */
    this.world = world;

    /**
     * Reference to the sound manager.
     * @type {SoundManager}
     */
    this.soundManager = soundManager;

    /**
     * Indicates if the game is currently running.
     * @type {boolean}
     */
    this.isGameRunning = false;

    /**
     * Indicates if the game is currently paused.
     * @type {boolean}
     */
    this.isPaused = false;

    /**
     * Indicates if the game is over.
     * @type {boolean}
     */
    this.isGameOver = false;

    /**
     * Reference to the game over screen DOM element.
     * @type {HTMLElement}
     */
    this.gameOverScreen = document.getElementById("game-over-screen");

    /**
     * Reference to the start screen DOM element.
     * @type {HTMLElement}
     */
    this.startScreen = document.getElementById("start-screen");

    /**
     * Reference to the canvas DOM element.
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.getElementById("canvas");
  }

  /**
   * Starts the game, hides start/game over screens, and runs the world.
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
   * Stops the game, clears intervals, removes listeners, and stops all objects.
   */
  stopGame() {
    if (!this.isGameRunning) return;
    this.isGameRunning = false;

    this.soundManager?.stopAll();
    clearInterval(this.world?.characterMovementInterval);
    clearInterval(this.world?.characterAnimationInterval);
    window.removeEventListener("keydown", handleKeyDown);

    this.world?.stopObjects?.();
    this.world?.character?.stop?.();
    this.world?.endboss?.stop?.();
    this.world?.stopGameLoop?.();
  }

  /**
   * Shows the end screen with win or lose image.
   * @param {boolean} [won=false] - True if the player won, false if lost.
   */
  showEndScreen(won = false) {
    const screen = this.gameOverScreen;
    const textImg = document.getElementById("game-over-image");

    if (!screen || !textImg)
      return console.error("❌ Endbildschirm-Elemente fehlen!");

    textImg.src = won
      ? "img/You won, you lost/You Win A.png"
      : "img/You won, you lost/Game over A.png";

    screen.classList.remove("hidden");
    screen.style.zIndex = "1000";
    this.canvas.style.opacity = 0.2;

    setTimeout(() => {
      screen.classList.add("visible");
    }, 800);
  }

  /**
   * Handles game over logic, stops the game, plays sound, and shows end screen.
   */
  gameOver() {
    this.isGameRunning = false;
    this.isGameOver = true;
    this.world?.stopGameLoop?.();

    setTimeout(() => {
      this.soundManager?.play("gameOver");
    }, 100);
    this.showEndScreen(false);
    this.soundManager?.stopAll();
  }

  /**
   * Handles game win logic, stops the game, plays sound, and shows win screen.
   */
  gameWon() {
    this.isGameRunning = false;
    this.world?.stopGameLoop?.();

    setTimeout(() => {
      this.soundManager?.play("gameWon");
    }, 50); // 100 ms warten
    this.showEndScreen(true);
    this.soundManager?.stopAll();
  }

  /**
   * Toggles the pause state of the game.
   */
  togglePause() {
    if (!this.isGameRunning) return;
    this.isPaused ? this.resumeGame() : this.pauseGame();
  }

  /**
   * Pauses the game and all objects.
   */
  pauseGame() {
    if (!this.isGameRunning) return;

    this.isPaused = true;
    this.world?.pauseObjects?.();
    this.soundManager?.pauseAll?.();
  }

  /**
   * Resumes the game and all objects.
   */
  resumeGame() {
    if (!this.isGameRunning) return;
    this.isPaused = false;
    this.world?.resumeObjects?.();
    this.soundManager?.resumeAll?.();
  }

  /**
   * Restarts the game by resetting state, clearing world, and starting a new game.
   */
  restartGame() {
    this.pauseAndResetState();
    this.clearWorld();
    this.startNewGame();
  }

  /**
   * Pauses and resets the game state, stops all sounds and the game.
   */
  pauseAndResetState() {
    this.soundManager?.stopAll();
    gameManager?.stopGame();
    keyboard.reset();
  }

  /**
   * Clears the world and hides the game over screen.
   */
  clearWorld() {
    if (world) {
      this.world.stopGameLoop();
      world = null;
    }
    hideGameOverScreen();
    canvas.style.opacity = 1;
  }

  /**
   * Initializes and starts a new game.
   */
  startNewGame() {
    initLevel();
    world = new World(canvas, keyboard, level1);
    world.soundManager = soundManager;

    gameManager = new GameManager(world);
    world.gameManager = gameManager;

    gameManager.startGame();
  }
}
