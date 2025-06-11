/**
 * Represents the game world, including the player, enemies, items, UI, and main game loop.
 * Handles drawing, collisions, item collection, pausing, resuming, and stopping the game.
 */
class World {
  // --- Eigenschaften ---

  /**
   * The main player character.
   * @type {Character}
   */
  character;

  /**
   * The endboss enemy.
   * @type {Endboss}
   */
  endboss;

  /**
   * The current level object.
   * @type {Level}
   */
  level = level1;

  /**
   * The canvas DOM element.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * The 2D rendering context for the canvas.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * The keyboard input handler.
   * @type {Keyboard}
   */
  keyboard;

  /**
   * The current camera x position.
   * @type {number}
   */
  camera_x = 0;

  /**
   * The x position where the level ends.
   * @type {number}
   */
  level_end_x = 6700;

  /**
   * Number of collected coins.
   * @type {number}
   */
  collectedCoins = 0;

  /**
   * Number of collected bottles.
   * @type {number}
   */
  collectedBottles = 0;

  /**
   * The health status bar.
   * @type {StatusBar}
   */
  healthBar;

  /**
   * The throw (bottle) status bar.
   * @type {StatusBar}
   */
  throwBar;

  /**
   * The coin status bar.
   * @type {StatusBar}
   */
  coinBar;

  /**
   * Array of background objects.
   * @type {Array}
   */
  backgroundObjects = [];

  /**
   * Array of throwable objects (e.g., bottles).
   * @type {Array}
   */
  throwableObjects = [];

  /**
   * Reference to the game manager.
   * @type {GameManager}
   */
  gameManager;

  /**
   * Timestamp when the world was created.
   * @type {number}
   */
  startTime;

  /**
   * Whether item collection is allowed (after delay).
   * @type {boolean}
   */
  allowCollection = false;

  /**
   * Whether the player can throw a bottle.
   * @type {boolean}
   */
  canThrow = true;

  /**
   * Creates a new World instance.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {Keyboard} keyboard - The keyboard input handler.
   * @param {Level} level - The level object.
   * @param {GameManager} gameManager - The game manager.
   */
  constructor(canvas, keyboard, level, gameManager) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.gameManager = gameManager;

    this.character = new Character(this);
    this.endboss = new Endboss(this.character, this);

    // Statusbars mit den jeweiligen Bildern initialisieren
    this.healthBar = new StatusBar("health", 0, 0, 250, 60);
    this.throwBar = new StatusBar("throw", 0, 50, 250, 60, true);
    this.coinBar = new StatusBar("coin", 0, 100, 250, 60, true);

    this.statusBarManager = new StatusBarManager(this);
    this.itemCollectionManager = new ItemCollectionManager(this);
    this.collisionManager = new CollisionManager(this);
    this.renderer = new Renderer(this);
    this.coinBar.setPercentage(0);

    // Set start time on creation
    this.startTime = Date.now();

    this.draw();
  }

  // --- Hauptlogik ---

  /**
   * Starts the main game loop (collision checks, throw checks, game over checks).
   */
  run() {
    if (this.gameManager.isPaused || !this.gameManager.isGameRunning) {
      return;
    }

    this.gameLoopInterval = setInterval(() => {
      if (!this.gameManager.isPaused) {
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkGameOver();
      }
    }, 200);
  }

  draw() {
    this.renderer.draw();
  }

  // If you need to add objects to the map from World:
  addObjectToMap(objects) {
    this.renderer.addObjectToMap(objects);
  }

  addToMap(mo) {
    this.renderer.addToMap(mo);
  }

  /**
   * Checks if the player can throw a bottle and handles bottle throwing logic.
   */
  checkThrowObjects() {
    if (!this.gameManager.isGameRunning) return;

    if (this.keyboard.D) {
      if (this.canThrow) {
        const didThrow = this.character.throwBottle();
        if (didThrow) this.updateThrowBar();
        this.canThrow = false;
      }
    } else {
      this.canThrow = true;
    }
    this.bottleEnemyCollision();
  }

  /**
   * Pauses all objects in the world (character, endboss, enemies, clouds).
   */
  pauseObjects() {
    if (this.level) {
      this.character.pause();
      this.endboss.pause();
      this.level.enemies.forEach((enemy) => enemy.pause());
      this.level.clouds.forEach((cloud) => cloud.pause());
    }
  }

  /**
   * Resumes all objects in the world (character, endboss, enemies, clouds).
   */
  resumeObjects() {
    if (this.level) {
      this.character.resume();
      this.endboss.resume();
      this.level.enemies.forEach((enemy) => enemy.resume());
      this.level.clouds.forEach((cloud) => cloud.resume());
    }
  }

  /**
   * Stops all objects and clears the main game loop interval.
   */
  stopObjects() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }

    if (this.character && typeof this.character.stop === "function")
      this.character.stop();
    if (this.endboss && typeof this.endboss.stop === "function")
      this.endboss.stop();
    for (let enemy of this.level.enemies || []) {
      if (typeof enemy.stop === "function") enemy.stop();
    }
  }

  /**
   * Stops the main game loop.
   */
  stopGameLoop() {
    this.stopObjects();
  }

  /**
   * Returns true if the character's health is zero or below.
   * @returns {boolean}
   */
  get isDead() {
    return this.health <= 0;
  }

  /**
   * Checks if the game is over (character dead), stops objects, and triggers game over logic.
   */
  checkGameOver() {
    if (!this.gameManager.isGameRunning) return;

    if (this.character.isDead) {
      this.gameManager.isGameRunning = false;
      this.stopObjects(); // Stoppt draw() und gameLoopInterval
      this.gameManager.gameOver(); // Zeigt ggf. Menü, etc.
    }
  }

  /**
   * Sets the background objects for the world and level.
   * @param {Array} backgroundObjects - The background objects.
   */
  setBackgroundObjects(backgroundObjects) {
    this.backgroundObjects = backgroundObjects;
    this.level.backgroundObjects = backgroundObjects;
  }

  /**
   * Updates the sound volume for coin and bottle collection sounds.
   */
  updateSoundVolume() {
    if (this.coinCollectSound) this.coinCollectSound.volume = this.soundVolume;
    if (this.bottleCollectSound)
      this.bottleCollectSound.volume = this.soundVolume;
  }

  // Replace these methods in World:
  checkCoinCollection() {
    this.itemCollectionManager.checkCoinCollection();
  }
  checkBottleCollection() {
    this.itemCollectionManager.checkBottleCollection();
  }
  updateThrowBar() {
    this.statusBarManager.updateThrowBar();
  }
  updateCoinBar() {
    this.statusBarManager.updateCoinBar();
  }
  updateHealthBar() {
    this.statusBarManager.updateHealthBar();
  }

  checkCollisions() {
    this.collisionManager.checkCollisions();
  }
  bottleEnemyCollision() {
    this.collisionManager.bottleEnemyCollision();
  }
}
