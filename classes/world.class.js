class World {
  // --- Eigenschaften ---
  character;
  endboss;
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  level_end_x = 6700;

  collectedCoins = 0;
  collectedBottles = 0;

  healthBar;
  throwBar;
  coinBar;

  backgroundObjects = [];
  throwableObjects = [];

  gameManager;

  // Add properties to control collection delay
  startTime;
  allowCollection = false;
  canThrow = true;

  // --- Konstruktor ---
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
  checkCollisions() {
    if (!this.gameManager.isGameRunning) return;

    this.character.checkCollisionsWithEnemy(this.level.enemies);
    this.character.checkCollisionsWithEndboss(this.endboss);

    this.updateHealthBar();
  }

  bottleEnemyCollision() {
    this.handleBottleHitsForEnemies();
    this.handleBottleHitForEndboss();
  }

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

  checkItemCollection(itemType, options) {
    const { items, characterProperty, sound, bar, maxItems, onCollect } =
      options;

    items.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        console.log(`${itemType} gesammelt`);
        items.splice(index, 1); // Entferne Item aus dem Level
        if (onCollect) onCollect();
        if (sound && soundManager) soundManager?.play(sound);
        if (bar && maxItems) {
          const percentage = (this.character[characterProperty] / maxItems) * 100;
          bar.setPercentage(percentage);
        }
      }
    });
  }

  pauseObjects() {
    if (this.level) {
      this.character.pause();
      this.endboss.pause();
      this.level.enemies.forEach((enemy) => enemy.pause());
      this.level.clouds.forEach((cloud) => cloud.pause());
    }
  }

  resumeObjects() {
    if (this.level) {
      this.character.resume();
      this.endboss.resume();
      this.level.enemies.forEach((enemy) => enemy.resume());
      this.level.clouds.forEach((cloud) => cloud.resume());
    }
  }

  stopObjects() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }

    if (this.character && typeof this.character.stop === "function")  this.character.stop();
    if (this.endboss && typeof this.endboss.stop === "function") this.endboss.stop();
    for (let enemy of this.enemies || []) {
      if (typeof enemy.stop === "function") enemy.stop();
    }
  }

  stopGameLoop() {
    this.stopObjects();
  }

  get isDead() {
    return this.health <= 0;
  }

  checkGameOver() {
    if (!this.gameManager.isGameRunning) return;

    if (this.character.isDead) {
      this.gameManager.isGameRunning = false;
      this.stopObjects(); // Stoppt draw() und gameLoopInterval
      this.gameManager.gameOver(); // Zeigt ggf. Menü, etc.
    }
  }

  // --- Hilfsfunktionen ---
  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);

    mo.draw(this.ctx);
    mo.drawHitbox(this.ctx);

    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  setBackgroundObjects(backgroundObjects) {
    this.backgroundObjects = backgroundObjects;
    this.level.backgroundObjects = backgroundObjects;
  }

  updateSoundVolume() {
    this.coinCollectSound.volume = this.soundVolume;
    this.bottleCollectSound.volume = this.soundVolume;
  }

  updateThrowBar() {
    const maxBottles = this.level.totalBottles || 30;
    const percentage = (this.character.collectedBottles / maxBottles) * 100;
    this.throwBar.setPercentage(percentage);
  }

  updateCoinBar() {
    const maxCoins = this.level.totalCoins || 40;
    const percentage = (this.character.collectedCoins / maxCoins) * 100;
    this.coinBar.setPercentage(percentage);
  }

   updateHealthBar() {
    const maxHealth = this.level.maxHealth || 100;
    const percentage = (this.character.health / maxHealth) * 100;
    this.healthBar.setPercentage(percentage);
  }
}
