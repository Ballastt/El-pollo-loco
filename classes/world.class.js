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

  /**
   * Draws all objects and UI elements to the canvas, and schedules the next frame.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Enable collection only after 1 second delay
    if (!this.allowCollection && Date.now() - this.startTime > 1000) {
      this.allowCollection = true;
    }

    if (this.allowCollection) {
      this.checkCoinCollection();
      this.checkBottleCollection();
    }

    // Kamerabewegung nur bis zum Levelende
    if (this.camera_x < this.level_end_x - this.canvas.width) {
      if (this.keyboard.RIGHT) {
        this.camera_x += 1;
      }
    }

    this.ctx.translate(this.camera_x, 0); // Kameradrehung initial

    // Bewegliche Objekte zeichnen
    this.addObjectToMap(this.backgroundObjects);
    this.addObjectToMap(this.level.coins);
    this.addObjectToMap(this.level.bottles);
    this.addObjectToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addToMap(this.endboss);
    this.addObjectToMap(this.level.enemies);
    this.addObjectToMap(this.throwableObjects);

    // Kamera zurücksetzen
    this.ctx.translate(-this.camera_x, 0);

    // UI-Elemente zeichnen
    this.addToMap(this.healthBar);
    this.addToMap(this.throwBar);
    this.addToMap(this.coinBar);

    // Nächster Frame
    requestAnimationFrame(() => this.draw());
  }

  // --- Kollisionen ---

  /**
   * Checks for collisions between the character and enemies/endboss, and updates health bar.
   */
  checkCollisions() {
    if (!this.gameManager.isGameRunning) return;

    this.character.checkCollisionsWithEnemy(this.level.enemies);
    this.character.checkCollisionsWithEndboss(this.endboss);

    this.updateHealthBar();
  }

  /**
   * Handles collisions between bottles and enemies/endboss.
   */
  bottleEnemyCollision() {
    this.handleBottleHitsForEnemies();
    this.handleBottleHitForEndboss();
  }

  /**
   * Handles bottle collisions with enemies.
   */
  handleBottleHitsForEnemies() {
    if (!this.gameManager.isGameRunning) return;

    this.throwableObjects.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isDead) {
          enemy.die();
          this.throwableObjects.splice(bottleIndex, 1);
        }
      });
    });
  }

  /**
   * Handles bottle collisions with the endboss.
   */
  handleBottleHitForEndboss() {
    if (!this.gameManager.isGameRunning) return;

    this.throwableObjects.forEach((bottle, bottleIndex) => {
      if (
        this.endboss &&
        bottle.isColliding(this.endboss) &&
        !this.endboss.isDead
      ) {
        this.endboss.hurt(20);
        this.throwableObjects.splice(bottleIndex, 1);
      }
    });
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

  // --- Sammelaktionen ---

  /**
   * Checks for coin collection by the character.
   */
  checkCoinCollection() {
    this.checkItemCollection("Coin", {
      items: this.level.coins,
      characterProperty: "collectedCoins",
      sound: "coinCollect",
      bar: this.coinBar,
      maxItems: this.level.totalCoins,
      onCollect: () => {
        this.character.collectedCoins++;
        this.updateCoinBar();
      },
    });
  }

  /**
   * Checks for bottle collection by the character.
   */
  checkBottleCollection() {
    this.checkItemCollection("Bottle", {
      items: this.level.bottles,
      characterProperty: "collectedBottles",
      sound: "bottleCollect",
      bar: this.throwBar,
      maxItems: this.level.totalBottles,
      onCollect: () => {
        this.character.collectedBottles++;
        this.updateThrowBar();
      },
    });
  }

  /**
   * Checks for item collection (coins or bottles) and updates state/UI.
   * @param {string} itemType - The type of item ("Coin" or "Bottle").
   * @param {Object} options - Collection options.
   * @param {Array} options.items - The array of items to check.
   * @param {string} options.characterProperty - The property to increment on the character.
   * @param {string} options.sound - The sound key to play on collection.
   * @param {StatusBar} options.bar - The status bar to update.
   * @param {number} options.maxItems - The maximum number of items.
   * @param {Function} options.onCollect - Callback to run on collection.
   */
  checkItemCollection(itemType, options) {
    const { items, characterProperty, sound, bar, maxItems, onCollect } =
      options;

    items.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        items.splice(index, 1); 
        if (onCollect) onCollect();
        if (sound && soundManager) soundManager?.play(sound);
        if (bar && maxItems) {
          const percentage =
            (this.character[characterProperty] / maxItems) * 100;
          bar.setPercentage(percentage);
        }
      }
    });
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
    for (let enemy of this.enemies || []) {
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

  // --- Hilfsfunktionen ---

  /**
   * Adds an array of objects to the map (draws them).
   * @param {Array} objects - The objects to add.
   */
  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Draws a single object to the map, handling direction and hitbox.
   * @param {MoveableObject} mo - The object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);

    mo.draw(this.ctx);
    mo.drawHitbox(this.ctx);

    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Flips the image horizontally for drawing mirrored objects.
   * @param {MoveableObject} mo - The object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the image after flipping.
   * @param {MoveableObject} mo - The object to restore.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
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
    this.coinCollectSound.volume = this.soundVolume;
    this.bottleCollectSound.volume = this.soundVolume;
  }

  /**
   * Updates the throw bar UI based on collected bottles.
   */
  updateThrowBar() {
    const maxBottles = this.level.totalBottles || 30;
    const percentage = (this.character.collectedBottles / maxBottles) * 100;
    this.throwBar.setPercentage(percentage);
  }

  /**
   * Updates the coin bar UI based on collected coins.
   */
  updateCoinBar() {
    const maxCoins = this.level.totalCoins || 40;
    const percentage = (this.character.collectedCoins / maxCoins) * 100;
    this.coinBar.setPercentage(percentage);
  }

  /**
   * Updates the health bar UI based on character health.
   */
  updateHealthBar() {
    const maxHealth = this.level.maxHealth || 100;
    const percentage = (this.character.health / maxHealth) * 100;
    this.healthBar.setPercentage(percentage);
  }
}
