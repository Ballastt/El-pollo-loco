/**
 * Represents the main player character in the game.
 * Handles movement, animation, collisions, state, and interactions.
 * @extends MoveableObject
 */
class Character extends MoveableObject {
  /** @type {World} Reference to the game world. */
  world;

  /** @type {number} Timestamp of the last time the character was hit. */
  lastHit = 0;

  /** @type {boolean} Indicates if the character is dead. */
  isDead = false;

  /** @type {number} Timestamp until which the character is hurt. */
  hurtUntil = 0;

  /** @type {boolean} Indicates if the character is currently snoring (long idle). */
  isSnoring = false;

  /**
   * Creates a new Character instance.
   * @param {World} world - The game world this character belongs to.
   */
  constructor(world) {
    super().loadImage("/img/2_character_pepe/2_walk/W-21.png");
    if (!world) throw new Error("world instance must be provided");

    this.world = world;
    this.health = 100;
    this.collectedCoins = 0;
    this.collectedBottles = 0;
    this.STATES = CharacterStates;
    this.IMAGES = CharacterAssets;
    this.soundManager = soundManager;
    this.currentState = this.STATES.IDLE;

    this.movementManager = new CharacterMovementManager(this);
    this.animationManager = new CharacterAnimationManager(this);
    this.collisionManager = new CharacterCollisionManager(this);
    this.soundManager = new CharacterSoundManager(this);

    this.initDimensions();
    this.initImages();
    this.initHitbox();
    this.applyGravity();
    this.animate();
  }

  /** Starts the movement and animation loops. */
  animate() {
    this.stop();
    this.paused = false;
    this.startMovementLoop();
    this.animationManager.startAnimationLoop();
  }

  /** Starts the movement loop interval. */
  startMovementLoop() {
    if (this.movementInterval) clearInterval(this.movementInterval);
    this.movementInterval = setInterval(() => {
      this.previousBottom = this.y + this.height;
      this.movementManager.handleMovement();
      this.soundManager.handleWalkingSound();
      this.movementManager.updateCamera();
      this.collisionManager.checkCollisionsWithEnemy(this.world.level.enemies);
      this.collisionManager.checkCollisionsWithEndboss(this.world.endboss);
      this.handleState();
    }, 1000 / 60);
  }

  /** Initializes character dimensions. */
  initDimensions() {
    this.x = 20;
    this.width = 120;
    this.height = 250;
    this.speed = 6;
    this.groundY = 174;
    this.y = this.groundY;
  }

  /** Loads all character image sets. */
  initImages() {
    this.loadImages(this.IMAGES.WALKING);
    this.loadImages(this.IMAGES.JUMPING);
    this.loadImages(this.IMAGES.IDLE);
    this.loadImages(this.IMAGES.LONG_IDLE);
    this.loadImages(this.IMAGES.HURT);
    this.loadImages(this.IMAGES.DEAD);
  }

  /** Initializes the character's hitbox. */
  initHitbox() {
    this.hitbox = {
      offsetX: 10,
      offsetY: 100,
      width: 86,
      height: 146,
    };
  }

  /**
   * Returns the current bounds of the character's hitbox.
   * @returns {Object} Hitbox boundary coordinates and center.
   */
  getHitboxBounds() {
    return {
      left: this.x + this.hitbox.offsetX,
      top: this.y + this.hitbox.offsetY,
      right: this.x + this.hitbox.offsetX + this.hitbox.width,
      bottom: this.y + this.hitbox.offsetY + this.hitbox.height,
      centerX: this.x + this.hitbox.offsetX + this.hitbox.width / 2,
      centerY: this.y + this.hitbox.offsetY + this.hitbox.height / 2,
    };
  }

  /** Stops movement and animation intervals. */
  stop() {
    if (this.movementInterval) clearInterval(this.movementInterval);
    if (this.animationManager?.animationInterval)
      clearInterval(this.animationManager.animationInterval);
  }

  /** Resets the character's complete state. */
  reset() {
    super.reset();
    this.resetStats();
    this.resetPosition();
    this.resetFlags();
    this.stop();
    this.animate();
    this.stopAllSounds();
    this.world.updateHealthBar();
    this.setState(this.STATES.IDLE);
  }

  /** Resets character statistics. */
  resetStats() {
    this.health = this.maxHealth;
    this.collectedCoins = 0;
    this.collectedBottles = 0;
    this.lastHit = 0;
    this.hurtUntil = 0;
    this.lastMoveTime = Date.now();
  }

  /** Resets character's position. */
  resetPosition() {
    this.x = 20;
    this.y = this.groundY;
    this.speedY = 0;
  }

  /** Resets character-specific flags. */
  resetFlags() {
    this.isDead = false;
    this.isSnoring = false;
    this.otherDirection = false;
    this.world?.soundManager?.stop("snoringPepe");
  }

  /**
   * Checks whether the character can currently receive damage.
   * @returns {boolean}
   */
  canBeHit() {
    return Date.now() - this.lastHit >= 800;
  }

  /**
   * Applies damage to the character and updates health.
   * @param {number} damage - The amount of damage to apply.
   */
  hit(damage) {
    if (this.world?.gameManager?.isPaused) return;
    const now = Date.now();
    if (now - this.lastHit < 1000) return;

    this.lastHit = now;
    this.health = Math.max(0, this.health - damage);
    this.world.updateHealthBar();
    this.world.soundManager?.play("hurtSound");
    if (this.health === 0) this.die();
  }

  /** Handles character death logic. */
  die() {
    super.die();
    this.playAnimation(this.IMAGES.DEAD);
    this.isDead = true;
    this.world.soundManager?.stop("walkingSound");
    this.world?.gameManager?.gameOver();
  }

  /** Evaluates and updates the character's current state. */
  handleState() {
    const now = Date.now();

    this.resetJumpFlagIfLanded();
    if (this.isDead) return;
    if (this.isHurt(now)) return;
    if (this.isAboveGround()) return this.setJumpingState(now);
    if (this.isMoving) return this.setWalking(now);

    this.animationManager.setIdleOrLongIdleState(now);
  }

  /** Resets the jump animation flag when landing after being airborne. */
  resetJumpFlagIfLanded() {
    const inAir = this.isAboveGround();
    if (!inAir && this.wasInAirLastFrame) {
      this.animationManager.resetJumpAnimationFlag();
    }
    this.wasInAirLastFrame = inAir;
  }

  /**
   * Checks if the character is currently in a hurt state.
   * @param {number} now - Current timestamp.
   * @returns {boolean}
   */
  isHurt(now) {
    if (this.hurtUntil && now < this.hurtUntil) {
      this.setState(this.STATES.HURT);
      return true;
    }
    return false;
  }

  /**
   * Updates character state to walking and sets movement timestamp.
   * @param {number} now - Current timestamp.
   */
  setWalking(now) {
    this.setWalkingState(now);
    this.lastMoveTime = now;
  }

  /**
   * Determines whether the character is jumping on the given enemy.
   * @param {Enemy} enemy
   * @returns {boolean}
   */
  isJumpingOnEnemy(enemy) {
    const charBox = this.getHitboxBounds();
    const enemyBox = enemy.getHitboxBounds();

    const isAbove = charBox.bottom > enemyBox.top && charBox.top < enemyBox.top;
    const isHorizontallyAligned =
      charBox.right > enemyBox.left && charBox.left < enemyBox.right;

    const isFalling = this.speedY < 0;
    const result = isAbove && isHorizontallyAligned && isFalling;

    return result;
  }

  /** Causes the character to bounce upward after jumping on an enemy. */
  bounceOffEnemy() {
    this.speedY = 15;
  }

  /**
   * Kills the enemy and applies a bounce to the character.
   * @param {Enemy} enemy
   */
  defeatEnemy(enemy) {
    enemy.die();
    this.bounceOffEnemy();
  }

  /**
   * Throws a bottle if one is available.
   * @returns {boolean} True if a bottle was thrown.
   */
  throwBottle() {
    if (this.collectedBottles <= 0) return false;
    this.collectedBottles--;
    const offsetX = this.otherDirection ? -10 : 60;
    const offsetY = 80;
    const bottle = new SalsaBottle(
      this.x + offsetX,
      this.y + offsetY,
      this.otherDirection,
      this.world
    );
    this.world.throwableObjects.push(bottle);
    this.world.updateThrowBar();
    return true;
  }

  /**
   * Sets the character's current state (idle, walking, jumping, etc.).
   * @param {string} state
   */
  setState(state) {
    this.currentState = state;
  }

  /** Delegated animation logic. */
  handleAnimations() {
    this.animationManager.handleAnimations();
  }

  /** Sets the character state to idle. */
  setIdle() {
    this.animationManager.setIdle();
  }

  /** Sets the character state to long idle (snoring). */
  setLongIdle() {
    this.animationManager.setLongIdle();
  }

  /**
   * Delegates idle/long idle logic based on inactivity.
   * @param {number} now - Current timestamp.
   */
  setIdleOrLongIdleState(now) {
    this.animationManager.setIdleOrLongIdleState(now);
  }

  /**
   * Delegates enemy collision detection to the collision manager.
   * @param {Array<Enemy>} enemies
   */
  checkCollisionsWithEnemy(enemies) {
    this.collisionManager.checkCollisionsWithEnemy(enemies);
  }

  /**
   * Delegates endboss collision detection to the collision manager.
   * @param {Endboss} endboss
   */
  checkCollisionsWithEndboss(endboss) {
    this.collisionManager.checkCollisionsWithEndboss(endboss);
  }

  /**
   * Triggers jump animation or sets jumping state.
   * @param {number} now - Current timestamp.
   */
  setJumpingState(now) {
    this.animationManager.setJumpingState?.(now) ??
      this.setState(this.STATES.JUMPING);
  }

  /**
   * Triggers walking animation or sets walking state.
   * @param {number} now - Current timestamp.
   */
  setWalkingState(now) {
    this.animationManager.setWalkingState?.(now) ??
      this.setState(this.STATES.WALKING);
  }
}
