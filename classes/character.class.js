class Character extends MoveableObject {
  // --- Konstanten ---
  IMAGES_WALKING = [
    "/img/2_character_pepe/2_walk/W-21.png",
    "/img/2_character_pepe/2_walk/W-22.png",
    "/img/2_character_pepe/2_walk/W-23.png",
    "/img/2_character_pepe/2_walk/W-24.png",
    "/img/2_character_pepe/2_walk/W-25.png",
    "/img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  STATES = {
    IDLE: "idle",
    LONG_IDLE: "long_idle",
    WALKING: "walking",
    JUMPING: "jumping",
    HURT: "hurting",
    DEAD: "dead",
  };

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

    this.healthBar;

    this.x = 20;
    this.width = 120;
    this.height = 250;

    this.speed = 6;
    this.groundY = 180;
    this.y = this.groundY;
    this.isDead = false;

    // Die Hitbox ist schmaler und zentriert
    this.hitbox = {
      offsetX: 10,
      offsetY: 100,
      width: 86,
      height: 146,
    };

    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.soundManager = soundManager;

    this.applyGravity();
    this.animate();

    this.currentState = this.STATES.IDLE;
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
    if (!this.canBeHit()) return;

    enemies.forEach((enemy) => this.handleEnemyCollision(enemy));
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

      this.health = Math.max(0, this.health);
      this.updateHealthBar();

      console.log(`Character getroffen! Gesundheit: ${this.health}`);
    }

    if (this.health === 0) this.die();
  }

  die() {
    super.die();
    this.playAnimation(this.IMAGES_DEAD);
    this.isDead = true;

    console.log("Der Charakter ist gestorben!");

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

    if (this.isSnoring) {
      this.world.soundManager.stop("snoringPepe");
      this.isSnoring = false;
    }
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
    switch (this.currentState) {
      case this.STATES.JUMPING:
        this.playAnimation(this.IMAGES_JUMPING);
        break;
      case this.STATES.WALKING:
        this.playAnimation(this.IMAGES_WALKING);
        break;
      case this.STATES.LONG_IDLE:
        this.playAnimation(this.IMAGES_LONG_IDLE);
        break;
      case this.STATES.IDLE:
        this.playAnimation(this.IMAGES_IDLE);
        break;
      case this.STATES.HURT:
        this.playAnimation(this.IMAGES_HURT);
        break;
      case this.STATES.DEAD:
        this.playAnimation(this.IMAGES_DEAD);
        break;
    }
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

    if (this.isSnoring) {
      this.world.soundManager.stop("snoringPepe");
      this.isSnoring = false;
    }
  }

  setIdleOrLongIdleState(now) {
    const idleDuration = now - (this.lastMoveTime || now);

    if (idleDuration > 10000) {
      this.setState(this.STATES.LONG_IDLE);

      if (!this.isSnoring) {
        this.world.soundManager.play("snoringPepe");
        this.isSnoring = true;
      }
    } else {
      this.setState(this.STATES.IDLE);

      if (this.isSnoring) {
        this.world.soundManager.stop("snoringPepe");
        this.isSnoring = false;
      }
    }
  }

  updateHealthBar() {
    const percentage = (this.health / this.maxHealth) * 100;
    if (this.world && this.world.healthBar) {
      this.world.healthBar.setPercentage(percentage);
    }
  }
}
