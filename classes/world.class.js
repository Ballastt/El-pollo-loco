class World {
  // --- Eigenschaften ---
  character;
  endboss;
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0; // Kameradrehung
  level_end_x = 6000;

  collectedCoins = 0;
  collectedBottles = 0;

  healthBar;
  throwBar;
  coinBar;

  throwableObjects = [];

  coinCollectSound;
  bottleCollectSound;
  soundVolume = 0.15;

  gameManager;

  // --- Konstruktor ---
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.character = new Character(this);
    this.endboss = new Endboss(this.character);
    this.gameManager = new GameManager(this);

    this.coinCollectSound = new Audio("audio/get_coin.mp3");
    this.bottleCollectSound = new Audio("audio/get_bottle.mp3");
    this.updateSoundVolume();

    // Statusbars mit den jeweiligen Bildern initialisieren
    this.healthBar = new StatusBar("health", 0, 0, 250, 60);
    this.throwBar = new StatusBar("throw", 0, 50, 250, 60, true);
    this.coinBar = new StatusBar("coin", 0, 100, 250, 60, true);

    this.coinBar.setPercentage(0);

    this.draw();
    this.run();
    this.checkCollisions();
  }

  // --- Hauptlogik ---
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkGameOver();
    }, 200);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.checkCoinCollection();
    this.checkBottleCollection();

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
        if (bottle.isColliding(enemy)) {
          console.log("Flasche trifft Feind", enemy);

          enemy.die(); // Huhn stirbt und entfernt sich selbst
          this.throwableObjects.splice(bottleIndex, 1); // Flasche entfernen
        }
      });
    });
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      this.character.throwBottle(); // Wurfaktion an Character delegieren
    }
    this.bottleEnemyCollision();
  }

  // --- Sammelaktionen ---
  checkCoinCollection() {
    this.checkItemCollection("Coin", {
      items: this.level.coins,
      characterProperty: "collectedCoins",
      sound: this.coinCollectSound,
      bar: this.coinBar,
      maxItems: this.level.totalCoins,
      onCollect: () => {
        console.log(
          `Coins collected: ${this.character.collectedCoins} / ${this.level.totalCoins}`
        );
      },
    });
  }

  checkBottleCollection() {
    this.checkItemCollection("Bottle", {
      items: this.level.bottles,
      characterProperty: "collectedBottles",
      sound: this.bottleCollectSound,
      bar: this.throwBar,
      maxItems: this.level.totalBottles,
      onCollect: () => {
        this.character.bottles++; // Increment available throwable bottles
        console.log(`Bottle added. Total bottles: ${this.character.bottles}`);
        this.character.updateThrowBar();
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

        // Charakter-Zähler aktualisieren
        this.character[characterProperty] =
          (this.character[characterProperty] || 0) + 1;

        // Aktion beim Sammeln
        if (onCollect) onCollect();

        // Audio abspielen
        if (sound) {
          sound.currentTime = 0;
          sound.play();
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
    console.log(`Updating ThrowBar: ${percentage}%`);
    this.throwBar.setPercentage(percentage);
  }
}
