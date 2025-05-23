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

  throwableObjects = [];

  gameManager;

  // Add properties to control collection delay
  startTime;
  allowCollection = false;

  // --- Konstruktor ---
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.character = new Character(this);
    this.endboss = new Endboss(this.character);
    this.gameManager = new GameManager(this);

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
    this.addObjectToMap(this.level.backgroundObjects);
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
    this.character.checkCollisionsWithEnemy(this.level.enemies);
    this.character.checkCollisionsWithEndboss(this.endboss);
    this.healthBar.setPercentage(this.character.health);
  }

  bottleEnemyCollision() {
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy) => {
        // Prüfen, ob die Flasche mit einem lebenden Feind kollidiert
        if (bottle.isColliding(enemy) && !enemy.isDead) {
          console.log("Flasche trifft Feind", enemy);

          enemy.die(); // Nur lebende Feinde sterben lassen
          this.throwableObjects.splice(bottleIndex, 1); // Flasche entfernen
        }
      });
    });
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      const didThrow = this.character.throwBottle(); // Rückgabewert prüfen
      if (didThrow) {
        this.updateThrowBar(); // Flasche wurde geworfen → Bar aktualisieren
      }
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
        console.log("onCollect() for coin called");
        console.log("Character in onCollect (coins):", this.character);
        this.character.collectedCoins++;
        console.log(
          `Coin added. Total coins: ${this.character.collectedCoins}`
        );
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
        console.log(
          `Bottle added. Total bottles: ${this.character.collectedBottles}`
        );
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

        // Aktion beim Sammeln
        if (onCollect) onCollect();

        // Audio abspielen
        if (sound && soundManager) {
          soundManager.play(sound);
        } else {
          console.warn(`SoundManager or soundName is not defined`);
        }

        // Statusleiste aktualisieren
        if (bar && maxItems) {
          const percentage =
            (this.character[characterProperty] / maxItems) * 100;
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
      console.log("Alle Objekte pausiert");
    }
  }

  resumeObjects() {
    if (this.level) {
      this.character.resume();
      this.endboss.resume();
      this.level.enemies.forEach((enemy) => enemy.resume());
      this.level.clouds.forEach((cloud) => cloud.resume());
      console.log("Alle Objekte fortgesetzt");
    }
  }

  stopObjects() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
      console.log("🌍 Game-Loop gestoppt");
    }

    if (this.character && typeof this.character.stop === "function") this.character.stop();
    if (this.endboss && typeof this.endboss.stop === "function") this.endboss.stop();
    
    for (let enemy of this.enemies || []) {
      if (typeof enemy.stop === "function") {
        enemy.stop();
      }
    }
    // weitere Objekte wie z. B. `coins`, `clouds`, `backgroundObjects`, wenn nötig
  }

  get isDead() {
    return this.health <= 0;
  }

  checkGameOver() {
    if (!this.gameManager.isGameRunning || this.character.isDead) {
      console.log("Game Over detected in World");
      this.gameManager.gameOver();
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

  updateSoundVolume() {
    this.coinCollectSound.volume = this.soundVolume;
    this.bottleCollectSound.volume = this.soundVolume;
  }

  updateThrowBar() {
    const maxBottles = this.level.totalBottles || 30;
    const percentage = (this.character.collectedBottles / maxBottles) * 100;

    console.log(
      `Updating ThrowBar: ${percentage}% (Collected: ${this.character.collectedBottles}, Total: ${maxBottles})`
    );

    if (this.throwBar) {
      this.throwBar.setPercentage(percentage);
    } else {
      console.error("ThrowBar is not initialized!");
    }
  }

  updateCoinBar() {
    const maxCoins = this.level.totalCoins || 40;
    const percentage = (this.character.collectedCoins / maxCoins) * 100;
    this.coinBar.setPercentage(percentage);
    console.log(`Updated CoinBar: ${percentage}%`);
  }
}
