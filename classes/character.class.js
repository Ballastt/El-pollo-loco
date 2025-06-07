class Character extends MoveableObject {
  // --- Eigenschaften ---
  world;
  lastHit = 0;
  isDead = false;
  hurtUntil = 0;
  isSnoring = false;

  // --- Konstruktor ---
  constructor(world) {
    super().loadImage("/img/2_character_pepe/2_walk/W-21.png");

    if (!world) throw new Error("world-instanz muss übergeben werden");
    this.world = world;

    this.health = 100;
    this.maxHealth = 100;
    this.collectedCoins = 0;
    this.collectedBottles = 0;

    // assuming this is loaded before character.js in HTML:
    this.STATES = CharacterStates;
    this.IMAGES = CharacterAssets;

    this.isDead = false;
    this.soundManager = soundManager;

    this.currentState = this.STATES.IDLE;

    this.initDimensions();
    this.initImages();
    this.initHitbox();
    this.applyGravity();
    this.animate();
  }

  // --- Animations- und Bewegungssteuerung ---
  animate() {
    this.startMovementLoop();
    this.startAnimationLoop();
  }

  startMovementLoop() {
    this.movementInterval = setInterval(() => {
      this.handleMovement();
      this.handleWalkingSound();
      this.updateCamera();
      this.checkCollisionsWithEnemy(this.world.level.enemies);
      this.checkCollisionsWithEndboss(this.world.endboss);
    }, 1000 / 60);
  }

  startAnimationLoop() {
    this.animationInterval = setInterval(() => {
      this.handleAnimations();
    }, 50);
  }

  initDimensions() {
    this.x = 20;
    this.width = 120;
    this.height = 250;
    this.speed = 6;
    this.groundY = 180;
    this.y = this.groundY;
  }

  initImages() {
    this.loadImages(this.IMAGES.WALKING);
    this.loadImages(this.IMAGES.JUMPING);
    this.loadImages(this.IMAGES.IDLE);
    this.loadImages(this.IMAGES.LONG_IDLE);
    this.loadImages(this.IMAGES.HURT);
    this.loadImages(this.IMAGES.DEAD);
  }

  initHitbox() {
    this.hitbox = {
      offsetX: 10,
      offsetY: 100,
      width: 86,
      height: 146,
    };
  }

  stop() {
    if (this.movementInterval) {
      clearInterval(this.movementInterval);
      this.movementInterval = null;
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    console.log("🛑 Charakter gestoppt.");
  }

  reset() {
    super.reset();

    this.resetStats();
    this.resetPosition();
    this.resetFlags();

    this.stop(); // Animationen und Bewegung stoppen
    this.animate(); // neu starten
    this.applyGravity(); // Gravitation reaktivieren
    this.stopAllSounds(); // Sounds sicherheitshalber stoppen
    this.world.updateHealthBar(); // Balken aktualisieren

    this.setState(this.STATES.IDLE);
  }

  resetStats() {
    this.health = this.maxHealth;
    this.collectedCoins = 0;
    this.collectedBottles = 0;
    this.lastHit = 0;
    this.hurtUntil = 0;
    this.lastMoveTime = Date.now();
  }

  resetPosition() {
    this.x = 20;
    this.y = this.groundY;
    this.speedY = 0;
  }

  resetFlags() {
    this.isDead = false;
    this.isSnoring = false;
    this.otherDirection = false;

    this.world?.soundManager?.stop("snoringPepe"); // Sicherheitsnetz
  }

  stopAllSounds() {
    const sm = this.world?.soundManager;
    if (!sm) return;
    sm.stop("snoringPepe");
    sm.stop("walkingSound");
  }

  // --- Kollision und Treffer ---
  checkCollisionsWithEndboss(endboss) {
    if (this.isColliding(endboss)) {
      console.log("Kollision mit dem Endboss");
      if (Date.now() > (this.lastCollision || 0) + 1000) {
        this.lastCollision = Date.now();
        this.currentState = this.STATES.HURT;
        this.hurtUntil = Date.now() + 500;

        endboss.hurt(10);
        this.hit(20);
      }
    }
  }

  checkCollisionsWithEnemy(enemies) {
    if (!this.world?.gameManager?.isGameRunning || this.isDead) return;
    if (!this.canBeHit()) return;

    for (let enemy of enemies) {
      if (enemy.isDead || !this.isColliding(enemy)) continue;

      console.log("Check Enemy:", enemy.constructor.name, enemy.x, enemy.y);
      console.log("isJumpingOnEnemy:", this.isJumpingOnEnemy(enemy));

      if (this.isJumpingOnEnemy(enemy)) {
        this.defeatEnemy(enemy);
      } else {
        this.receiveHitFrom(enemy);
        break; // 👉 Nach einem Treffer abbrechen!
      }
    }
  }

  canBeHit() {
    return Date.now() - this.lastHit >= 500;
  }

  handleEnemyCollision(enemy) {
    if (enemy.isDead || !this.isColliding(enemy)) return;

    if (this.isJumpingOnEnemy(enemy)) {
      this.defeatEnemy(enemy);
    } else {
      this.receiveHitFrom(enemy);
    }
  }

  defeatEnemy(enemy) {
    console.log(`Enemy defeated by jumping: ${enemy.constructor.name}`);
    enemy.die();
    this.bounceOffEnemy();
  }

  receiveHitFrom(enemy) {
    const now = Date.now();
    this.currentState = this.STATES.HURT;
    this.hit(10);
    console.log(
      `Collision with ${enemy.constructor.name}, remaining health: ${this.health}`
    );
    this.lastHit = now;
    this.hurtUntil = now + 500;
  }

  isJumpingOnEnemy(enemy) {
    const characterBottom = this.y + this.height;
    const enemyTop = enemy.y;
    const horizontalOverlap =
      this.x + this.width > enemy.x && this.x < enemy.x + enemy.width;

    return (
      characterBottom >= enemyTop && horizontalOverlap && this.isAboveGround()
    );
  }

  bounceOffEnemy() {
    this.speedY = 15;
  }

  hit(damage) {
    let now = Date.now();
    if (now - this.lastHit > 1000) {
      console.log("Character hit() aufgerufen");
      super.hit(damage);
      this.lastHit = now;

      if (this.world.soundManager) this.world.soundManager.play("hurtSound");

      this.health = Math.max(0, this.health - damage);
      this.world.updateHealthBar();

      console.log(`Character getroffen! Gesundheit: ${this.health}`);
    }

    if (this.health === 0) this.die();
  }

  die() {
    super.die();
    this.playAnimation(this.IMAGES.DEAD);
    this.isDead = true;

    console.log("Der Charakter ist gestorben!");
    console.log(this.world.gameManager);
    if (this.world.soundManager) this.world.soundManager.stop("walkingSound");
    if (this.world && this.world.gameManager) this.world.gameManager.gameOver();
  }

  // --- Bewegungs- und Statussteuerung ---
  handleMovement() {
    this.handleInput();
    this.handleState();
  }

  handleInput() {
    if (this.isDead || Date.now() < this.hurtUntil) return;
    this.isMoving = false;
    if (!this.lastMoveTime) this.lastMoveTime = Date.now();

    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x)
      this.handleRightInput();
    if (this.world.keyboard.LEFT && this.x > 0) this.handleLeftInput();
    if (this.world.keyboard.UP && !this.isAboveGround()) this.handleJumpInput();
  }

  handleState() {
    const now = Date.now();

    if (this.isDead) return this.setState(this.STATES.DEAD);
    if (now < this.hurtUntil) return this.setState(this.STATES.HURT);
    if (this.isAboveGround()) return this.setJumpingState(now);
    if (this.isMoving) return this.setWalkingState(now);

    return this.setIdleOrLongIdleState(now);
  }

  handleWalkingSound() {
    if (this.isMoving) {
      if (this.world.soundManager) this.world.soundManager.play("walkingSound");
    } else {
      if (this.world.soundManager) this.world.soundManager.stop("walkingSound");
    }
  }

  // --- Animationen ---
  handleAnimations() {
    const animationMap = {
      [this.STATES.JUMPING]: this.IMAGES.JUMPING,
      [this.STATES.WALKING]: this.IMAGES.WALKING,
      [this.STATES.LONG_IDLE]: this.IMAGES.LONG_IDLE,
      [this.STATES.IDLE]: this.IMAGES.IDLE,
      [this.STATES.HURT]: this.IMAGES.HURT,
      [this.STATES.DEAD]: this.IMAGES.DEAD,
    };

    this.playAnimation(animationMap[this.currentState]);
  }

  // --- Aktionen ---
  throwBottle() {
    console.log("Available bottles:", this.collectedBottles);

    if (this.collectedBottles > 0) {
      this.collectedBottles--;

      const offsetX = this.otherDirection ? -10 : 60;
      const offsetY = 80;

      const bottle = new SalsaBottle(
        this.x + offsetX,
        this.y + offsetY,
        this.otherDirection,
        this.world // World-Referenz
      );

      this.world.throwableObjects.push(bottle);
      this.world.updateThrowBar();

      return true; // Flasche erfolgreich geworfen
    }

    return false; // Keine Flaschen vorhanden → kein Wurf
  }

  // --- Kamera und Fortschrittsanzeige ---
  updateCamera() {
    if (this.world) {
      this.world.camera_x = -this.x + 100;
    }
  }

  //Hilfsmethoden
  handleRightInput() {
    this.moveRight();
    this.isMoving = true;
  }

  handleLeftInput() {
    this.moveLeft();
    this.isMoving = true;
  }

  handleJumpInput() {
    this.jump();
    if (this.world.soundManager) {
      this.world.soundManager.play("jumpSound");
    }
  }

  setState(state) {
    this.currentState = state;
  }

  setJumpingState(now) {
    this.setState(this.STATES.JUMPING);
    this.lastMoveTime = now;
  }

  setWalkingState(now) {
    this.setState(this.STATES.WALKING);
    this.lastMoveTime = now;
  }

  setIdleOrLongIdleState(now) {
    const idleDuration = now - (this.lastMoveTime || now);
    if (idleDuration > 8000) {
      this.setLongIdle();
    } else {
      this.setIdle();
    }
  }

  setIdle() {
    this.setState(this.STATES.IDLE);
    if (this.isSnoring) {
      this.world.soundManager.stop("snoringPepe");
      this.isSnoring = false;
    }
  }

  setLongIdle() {
    if (this.world?.gameManager?.isPaused) return; // während Pause kein Schnarchen starten
    this.setState(this.STATES.LONG_IDLE);
    if (!this.isSnoring) {
      this.world.soundManager.play("snoringPepe");
      this.isSnoring = true;
    }
  }
}
