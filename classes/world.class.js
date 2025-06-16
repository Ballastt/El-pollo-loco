/**
 * Represents the game world, including the player, enemies, items, UI, and main game loop.
 * Handles rendering, collisions, item collection, pausing/resuming, and stopping the game.
 */
class World {
  // --- Properties ---
  /** @type {Character} The main player character. */
  character;

  /** @type {Endboss} The endboss enemy. */
  endboss;

  /** @type {Level} The current level object. */
  level = level1;

  /** @type {HTMLCanvasElement} The canvas DOM element. */
  canvas;

  /** @type {CanvasRenderingContext2D} The 2D drawing context. */
  ctx;

  /** @type {Keyboard} The keyboard input handler. */
  keyboard;

  /** @type {number} The camera x-position offset for scrolling. */
  camera_x = 0;

  /** @type {number} The x-position where the level ends. */
  level_end_x = 6800;

  /** @type {number} Number of collected coins. */
  collectedCoins = 0;

  /** @type {number} Number of collected bottles. */
  collectedBottles = 0;

  /** @type {StatusBar} Health status bar UI. */
  healthBar;

  /** @type {StatusBar} Bottle-throw status bar UI. */
  throwBar;

  /** @type {StatusBar} Coin status bar UI. */
  coinBar;

  /** @type {Array<Object>} Background layer objects. */
  backgroundObjects = [];

  /** @type {Array<ThrowableObject>} Active thrown objects. */
  throwableObjects = [];

  /** @type {GameManager} Controls overall game state. */
  gameManager;

  /** @type {number} Timestamp when the world was created. */
  startTime;

  /** @type {boolean} Whether the player is allowed to collect items. */
  allowCollection = false;

  /** @type {boolean} Whether the player is allowed to throw a bottle. */
  canThrow = true;
  
  /** @type {boolean} Whether the endboss health bar has been activated */
  endbossEncounterStarted = false;

  /**
   * Creates a new game world.
   * @param {HTMLCanvasElement} canvas - The rendering canvas.
   * @param {Keyboard} keyboard - The keyboard input handler.
   * @param {Level} level - The current level instance.
   * @param {GameManager} gameManager - The game manager instance.
   */
  constructor(canvas, keyboard, level, gameManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.level = level;
    this.gameManager = gameManager;

    this.character = new Character(this);
    this.endboss = new Endboss(this.character, this);

    this.healthBar = new StatusBar("health", 0, 0, 250, 60);
    this.throwBar = new StatusBar("throw", 0, 50, 250, 60, true);
    this.coinBar = new StatusBar("coin", 0, 100, 250, 60, true);
    // Example values, adjust x/y/width/height as needed for your UI
    this.endbossHealthBar = new StatusBar("endboss", 460, 0, 250, 60);
    this.endbossHealthBar.setPercentage(100); // Start full

    this.statusBarManager = new StatusBarManager(this);
    this.itemCollectionManager = new ItemCollectionManager(this);
    this.collisionManager = new CollisionManager(
      this,
      this.character,
      this.endboss,
      this.throwableObjects,
      gameManager
    );

    this.renderer = new Renderer(this);
    this.coinBar.setPercentage(0);
    this.startTime = Date.now();
    this.renderer.start();
  }

  /**
   * Starts the main game loop (collisions, throw checks, game-over detection).
   */
  run() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }

    console.log("[World] run");

    if (this.gameManager.isPaused || !this.gameManager.isGameRunning) return;

    this.gameLoopInterval = setInterval(() => {
      if (!this.gameManager.isPaused) {
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkGameOver();
      }
    }, 200);
  }

  /**
   * Stops and cleans up the world (game loop, rendering).
   */
  cleanup() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
      console.log("[World] cleanup: cleared gameLoopInterval");
    }
    this.renderer?.stop();
  }

  /** Draws the entire game world (delegates to Renderer). */
  draw() {
    this.renderer.draw();
  }

  /**
   * Adds one or more objects to the render list.
   * @param {Array<DrawableObject>} objects - Objects to be rendered.
   */
  addObjectToMap(objects) {
    this.renderer.addObjectToMap(objects);
  }

  /**
   * Adds a single object to the render list.
   * @param {DrawableObject} mo - Object to add.
   */
  addToMap(mo) {
    this.renderer.addToMap(mo);
  }

  /**
   * Checks if the player has pressed the throw key and handles bottle throwing logic.
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

  /** Pauses all moving objects in the world. */
  pauseObjects() {
    if (!this.level) return;
    this.character.pause();
    this.endboss.pause();
    this.level.enemies.forEach((enemy) => enemy.pause());
    this.level.clouds.forEach((cloud) => cloud.pause());
  }

  /** Resumes all previously paused objects in the world. */
  resumeObjects() {
    if (!this.level) return;
    this.character.resume();
    this.endboss.resume();
    this.level.enemies.forEach((enemy) => enemy.resume());
    this.level.clouds.forEach((cloud) => cloud.resume());
  }

  /** Stops all objects and the main game loop. */
  stopObjects() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }

    this.character?.stop?.();
    this.endboss?.stop?.();

    for (let enemy of this.level.enemies || []) {
      enemy?.stop?.();
    }
  }

  /** Fully stops the game logic and rendering. */
  stopGameLoop() {
    this.character.stop();
    this.stopObjects();
  }

  /**
   * Returns true if the character is dead.
   * @returns {boolean}
   */
  get isDead() {
    return this.health <= 0;
  }

  /**
   * Checks if the game is over (e.g., character died), and stops the world if so.
   */
  checkGameOver() {
    if (!this.gameManager.isGameRunning) return;

    if (this.character.isDead) {
      this.gameManager.isGameRunning = false;
      this.stopObjects();
      this.gameManager.gameOver();
    }
  }

  /**
   * Sets the background layers for the level.
   * @param {Array<Object>} backgroundObjects - Background layers to assign.
   */
  setBackgroundObjects(backgroundObjects) {
    this.backgroundObjects = backgroundObjects;
    this.level.backgroundObjects = backgroundObjects;
  }

  /** Updates sound volumes for collection sounds. */
  updateSoundVolume() {
    if (this.coinCollectSound) {
      this.coinCollectSound.volume = this.soundVolume;
    }
    if (this.bottleCollectSound) {
      this.bottleCollectSound.volume = this.soundVolume;
    }
  }

  // --- Delegated Methods (Manager Classes) ---

  /** Checks coin collection logic. */
  checkCoinCollection() {
    this.itemCollectionManager.checkCoinCollection();
  }

  /** Checks bottle collection logic. */
  checkBottleCollection() {
    this.itemCollectionManager.checkBottleCollection();
  }

  /** Updates the throw bar UI. */
  updateThrowBar() {
    this.statusBarManager.updateThrowBar();
  }

  /** Updates the coin bar UI. */
  updateCoinBar() {
    this.statusBarManager.updateCoinBar();
  }

  /** Updates the health bar UI. */
  updateHealthBar() {
    this.statusBarManager.updateHealthBar();
  }

  /** Performs collision checks for all entities. */
  checkCollisions() {
    this.collisionManager.checkCollisions();
  }

  /** Checks for collisions between bottles and enemies. */
  bottleEnemyCollision() {
    this.collisionManager.bottleEnemyCollision();
  }
}
