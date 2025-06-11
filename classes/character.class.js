/**
 * Represents the main player character in the game.
 * Handles movement, animation, collisions, state, and interactions.
 * @extends MoveableObject
 */
class Character extends MoveableObject {
  /**
   * Reference to the game world.
   * @type {World}
   */
  world;

  /**
   * Timestamp of the last time the character was hit.
   * @type {number}
   */
  lastHit = 0;

  /**
   * Indicates if the character is dead.
   * @type {boolean}
   */
  isDead = false;

  /**
   * Timestamp until which the character is hurt.
   * @type {number}
   */
  hurtUntil = 0;

  /**
   * Indicates if the character is currently snoring (long idle).
   * @type {boolean}
   */
  isSnoring = false;

  /**
   * Creates a new Character instance.
   * @param {World} world - The game world instance.
   */
  constructor(world) {
    super().loadImage("/img/2_character_pepe/2_walk/W-21.png");

    if (!world) throw new Error("world-instanz muss übergeben werden");
    this.world = world;

    /**
     * The character's health.
     * @type {number}
     */
    this.health = 100;

    /**
     * Number of collected coins.
     * @type {number}
     */
    this.collectedCoins = 0;

    /**
     * Number of collected bottles.
     * @type {number}
     */
    this.collectedBottles = 0;

    // assuming this is loaded before character.js in HTML:
    /**
     * Character state constants.
     * @type {Object}
     */
    this.STATES = CharacterStates;

    /**
     * Character image assets.
     * @type {Object}
     */
    this.IMAGES = CharacterAssets;

    this.isDead = false;

    /**
     * Reference to the sound manager.
     * @type {SoundManager}
     */
    this.soundManager = soundManager;

    /**
     * The current state of the character.
     * @type {string}
     */
    this.currentState = this.STATES.IDLE;

    this.initDimensions();
    this.initImages();
    this.initHitbox();
    this.applyGravity();
    this.animate();
  }

  /**
   * Starts the movement and animation loops.
   */
  animate() {
    this.startMovementLoop();
    this.startAnimationLoop();
  }

  /**
   * Starts the movement interval.
   */
  startMovementLoop() {
    this.movementInterval = setInterval(() => {
      this.handleMovement();
      this.handleWalkingSound();
      this.updateCamera();
      this.checkCollisionsWithEnemy(this.world.level.enemies);
      this.checkCollisionsWithEndboss(this.world.endboss);
    }, 1000 / 60);
  }

  /**
   * Initializes character dimensions.
   */
  initDimensions() {
    this.x = 20;
    this.width = 120;
    this.height = 250;
    this.speed = 6;
    this.groundY = 180;
    this.y = this.groundY;
  }

  /**
   * Loads all character images.
   */
  initImages() {
    this.loadImages(this.IMAGES.WALKING);
    this.loadImages(this.IMAGES.JUMPING);
    this.loadImages(this.IMAGES.IDLE);
    this.loadImages(this.IMAGES.LONG_IDLE);
    this.loadImages(this.IMAGES.HURT);
    this.loadImages(this.IMAGES.DEAD);
  }

  /**
   * Initializes the character's hitbox.
   */
  initHitbox() {
    this.hitbox = {
      offsetX: 10,
      offsetY: 100,
      width: 86,
      height: 146,
    };
  }

  /**
   * Stops all movement and animation intervals.
   */
  stop() {
    if (this.movementInterval) {
      clearInterval(this.movementInterval);
      this.movementInterval = null;
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  /**
   * Resets the character to its initial state.
   */
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

  /**
   * Resets character stats (health, coins, bottles, etc).
   */
  resetStats() {
    this.health = this.maxHealth;
    this.collectedCoins = 0;
    this.collectedBottles = 0;
    this.lastHit = 0;
    this.hurtUntil = 0;
    this.lastMoveTime = Date.now();
  }

  /**
   * Resets character position.
   */
  resetPosition() {
    this.x = 20;
    this.y = this.groundY;
    this.speedY = 0;
  }

  /**
   * Resets character flags (dead, snoring, etc).
   */
  resetFlags() {
    this.isDead = false;
    this.isSnoring = false;
    this.otherDirection = false;

    this.world?.soundManager?.stop("snoringPepe"); // Sicherheitsnetz
  }

  /**
   * Returns true if the character can be hit.
   * @returns {boolean}
   */
  canBeHit() {
    return Date.now() - this.lastHit >= 800;
  }

  /**
   * Handles receiving a hit from an enemy.
   */
  receiveHitFrom() {
    this.setState(this.STATES.HURT);
    this.hurtUntil = Date.now() + 500;
    this.hit(10);
  }

  /**
   * Applies damage to the character.
   * @param {number} damage
   */
  hit(damage) {
    const now = Date.now();
    if (now - this.lastHit < 1000) return; // Doppeltreffer blockieren

    this.lastHit = now;

    this.health = Math.max(0, this.health - damage);
    this.world.updateHealthBar();
    if (this.world.soundManager) this.world.soundManager.play("hurtSound");
    if (this.health === 0) this.die();
  }

  /**
   * Handles character death.
   */
  die() {
    super.die();
    this.playAnimation(this.IMAGES.DEAD);
    this.isDead = true;

    if (this.world.soundManager) this.world.soundManager.stop("walkingSound");
    this.world?.gameManager?.gameOver(); // Spiel beenden
  }

  /**
   * Updates the character's state based on current conditions.
   */
  handleState() {
    const now = Date.now();

    if (this.isDead) return this.setState(this.STATES.DEAD);
    if (now < this.hurtUntil) return this.setState(this.STATES.HURT);
    if (this.isAboveGround()) return this.setJumpingState(now);
    if (this.isMoving) return this.setWalkingState(now);

    return this.setIdleOrLongIdleState(now);
  }

  /**
   * Defeats an enemy and bounces off.
   * @param {Enemy} enemy
   */
  defeatEnemy(enemy) {
    enemy.die();
    this.bounceOffEnemy();
  }

  /**
   * Returns true if the character is jumping on the enemy.
   * @param {Enemy} enemy
   * @returns {boolean}
   */
  isJumpingOnEnemy(enemy) {
    const characterBottom = this.y + this.height;
    const enemyTop = enemy.y;
    const horizontalOverlap =
      this.x + this.width > enemy.x && this.x < enemy.x + enemy.width;

    return (
      characterBottom >= enemyTop && horizontalOverlap && this.isAboveGround()
    );
  }

  /**
   * Makes the character bounce after defeating an enemy.
   */
  bounceOffEnemy() {
    this.speedY = 15;
  }

  /**
   * Throws a bottle if available.
   * @returns {boolean} True if a bottle was thrown.
   */
  throwBottle() {
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

  /**
   * Sets the character's state.
   * @param {string} state
   */
  setState(state) {
    this.currentState = state;
  }
}
