/**
 * Represents the Endboss enemy in the game.
 * Handles state, animation, movement, collision, and sound logic.
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {
  /**
   * Reference to the game world.
   * @type {World}
   */
  world;

  /**
   * Reference to the player character.
   * @type {Character}
   */
  character;

  /**
   * Height of the endboss.
   * @type {number}
   */
  height = 400;

  /**
   * Width of the endboss.
   * @type {number}
   */
  width = 300;

  /**
   * Health of the endboss.
   * @type {number}
   */
  health = 200;

  /**
   * Maximum health of the endboss.
   * @type {number}
   */
  maxHealth = 200;

  /**
   * Indicates if the endboss is dead.
   * @type {boolean}
   */
  isDead = false;

  /**
   * Timestamp until which the endboss is hurt.
   * @type {number}
   */
  hurtUntil = 0;

  /**
   * Current state of the endboss.
   * @type {string}
   */
  currentState = "walking";

  /**
   * Walking speed.
   * @type {number}
   */
  speedWalk = 15;

  /**
   * Attack speed.
   * @type {number}
   */
  speedAttack = 60;

  /**
   * Jump force for the endboss.
   * @type {number}
   */
  jumpForce = 30;

  /**
   * Cooldown timestamp for charging attack.
   * @type {number}
   */
  chargeCooldown = 0;

  /**
   * Indicates if the intro sound has been played.
   * @type {boolean}
   */
  introSoundPlayed = false;

  /**
   * Indicates if the endboss is paused.
   * @type {boolean}
   */
  isPaused = false;

  /**
   * Minimum distance to the player before stopping movement.
   * @type {number}
   */
  MIN_DISTANCE_TO_PLAYER = 150;

  /**
   * Indicates if the intro phase is active.
   * @type {boolean}
   */
  introPhaseActive = true;

  /**
   * Timestamp when the intro started.
   * @type {?number}
   */
  introStartedAt = null;

  /**
   * Duration of the intro phase in milliseconds.
   * @type {number}
   */
  introDuration = 3000;

  /**
   * Creates a new Endboss instance.
   * @param {Character} character - The player character.
   * @param {World} world - The game world instance.
   */
  constructor(character, world) {
    super();
    this.ATTACK_DISTANCE = 370;
    this.character = character;
    this.world = world;
    this.gameManager = world?.gameManager;
    this.soundManager = soundManager;

    // Use the global EndbossAssets and EndbossStates
    this.IMAGES_WALKING = EndbossAssets.WALKING;
    this.IMAGES_ALERT = EndbossAssets.ALERT;
    this.IMAGES_ATTACK = EndbossAssets.ATTACK;
    this.IMAGES_HURT = EndbossAssets.HURT;
    this.IMAGES_DEAD = EndbossAssets.DEAD;

    this.STATES = EndbossStates;

    this.animationManager = new EndbossAnimationManager(this);
    this.movementManager = new EndbossMovementManager(this);

    this.initImages();
    this.initPosition();
    this.initHitbox();

    this.applyGravity();
    this.animate();
  }

  /**
   * Starts the animation loop for the endboss.
   */
  animate() {
    this.startAnimationLoop();
  }

  /**
   * Starts the animation interval for the endboss.
   */
  startAnimationLoop() {
    this.animationInterval = setInterval(() => {
      if (this.isPaused) return;
      this.animationManager.handleAnimations();
      this.animationManager.updateState();
      this.movementManager.moveDependingOnState();
    }, 100);
  }

  /**
   * Initializes the endboss position.
   */
  initPosition() {
    this.x = 6500;
    this.y = 50;
    this.groundY = 50;
  }

  /**
   * Loads all endboss images.
   */
  initImages() {
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Initializes the endboss hitbox.
   */
  initHitbox() {
    this.hitbox = {
      offsetX: 10,
      offsetY: 100,
      width: 300,
      height: 300,
    };
  }

  /**
   * Pauses the endboss animation and logic.
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resumes the endboss animation and logic.
   */
  resume() {
    this.isPaused = false;
  }

  /**
   * Calculates the distance between the endboss and the character.
   * @param {number} characterX - X position of the character.
   * @param {number} characterY - Y position of the character.
   * @returns {number} The distance.
   */
  calculateDistance(characterX, characterY) {
    const dx = this.x - characterX;
    const dy = this.y - characterY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Ensures the clucking sound is playing if appropriate.
   */
  ensureClucking() {
    if (
      !this.isDead &&
      Date.now() >= this.hurtUntil &&
      !this.soundManager.play("endbossClucking")
    ) {
      this.soundManager.play("endbossClucking");
    }
  }

  /**
   * Hurts the endboss, reducing its health and triggering hurt state.
   * @param {number} [damage=10] - The amount of damage.
   */
  hurt(damage = 10) {
    const now = Date.now();
    if (now < this.hurtUntil || this.isDead) return;

    this.applyDamage(damage);

    if (this.isDead) return;

    this.hurtUntil = now + 2000;
    this.updateHealthBar();
    this.soundManager.play("endbossHurt");
    this.animationManager.handleHurtState();
  }

  /**
   * Applies damage to the endboss and checks for death.
   * @param {number} damage
   */
  applyDamage(damage) {
    this.health -= damage;

    if (this.health <= 0) {
      this.health = 0;
      this.updateHealthBar(); 
      this.isDead = true;
  
      this.die();
    } else {
      this.updateHealthBar(); 
    }
  }

  /**
   * Updates the endboss health bar UI.
   */
  updateHealthBar() {
    if (this.world?.endbossHealthBar) {
      const percent = (this.health / this.maxHealth) * 100;
      this.world.endbossHealthBar.setPercentage(percent);
    }
  }

  /**
   * Handles the death of the endboss, plays sounds, and triggers game win.
   */
  die() {
    this.isDead = true;
    this.currentState = this.STATES.DEAD;
    this.playAnimation(this.IMAGES_DEAD);

    this.soundManager.play("endbossDying");
    this.soundManager.stop("endbossClucking");
    this.soundManager.stop("endbossAngry");

    setTimeout(() => {
      this.soundManager.play("gameWon");
      this.world.gameManager.gameWon?.();
    }, 2000);
  }

  /**
   * Stops the endboss animation interval.
   */
  stop() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }
}
