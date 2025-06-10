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
  speedAttack = 45;

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
   * Distance at which the endboss starts attacking.
   * @type {number}
   */
  ATTACK_DISTANCE = 370;

  /**
   * Walking animation images.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /**
   * Alert animation images.
   * @type {string[]}
   */
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /**
   * Attack animation images.
   * @type {string[]}
   */
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /**
   * Hurt animation images.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /**
   * Dead animation images.
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * State constants for the endboss.
   * @type {Object}
   */
  STATES = {
    WALKING: "walking",
    ALERT: "alert",
    ATTACK: "attack",
    HURT: "hurt",
    DEAD: "dead",
  };

  /**
   * Creates a new Endboss instance.
   * @param {Character} character - The player character.
   * @param {World} world - The game world instance.
   */
  constructor(character, world) {
    super();
    this.character = character;
    this.world = world;
    this.gameManager = world?.gameManager;
    this.soundManager = soundManager;

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
      this.handleAnimations();
      this.updateState();
      this.moveDependingOnState();
    }, 100);
  }

  /**
   * Initializes the endboss position.
   */
  initPosition() {
    this.x = 6300;
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
   * Handles the endboss animation based on its current state.
   */
  handleAnimations() {
    switch (this.currentState) {
      case this.STATES.WALKING:
        this.playAnimation(this.IMAGES_WALKING);
        break;
      case this.STATES.ALERT:
        this.playAnimation(this.IMAGES_ALERT);
        break;
      case this.STATES.ATTACK:
        this.playAnimation(this.IMAGES_ATTACK);
        break;
      case this.STATES.HURT:
        this.playAnimation(this.IMAGES_HURT);
        break;
      case this.STATES.DEAD:
        this.playAnimation(this.IMAGES_DEAD);
        break;
    }
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
   * Updates the endboss state based on health, distance, and timers.
   */
  updateState() {
    if (this.isDead) return;
    if (this.health <= 0) return this.die();
    if (Date.now() < this.hurtUntil) return this.setHurtState();

    const distanceToPlayer = this.calculateDistance(
      this.character.x,
      this.character.y
    );

    if (distanceToPlayer < this.ATTACK_DISTANCE) return this.setAttackState();
    if (distanceToPlayer < 400) return this.setAlertState();
    return this.setWalkingState();
  }

  /**
   * Sets the endboss to the hurt state and stops relevant sounds.
   */
  setHurtState() {
    this.currentState = this.STATES.HURT;
    this.soundManager.stop("endbossClucking");
    this.soundManager.stop("endbossAngry");
  }

  /**
   * Sets the endboss to the attack state and plays relevant sounds.
   */
  setAttackState() {
    if (this.currentState !== this.STATES.ATTACK) {
      this.soundManager.stop("endbossClucking");
      this.soundManager.play("endbossAngry");
    }
    this.currentState = this.STATES.ATTACK;
  }

  /**
   * Sets the endboss to the alert state and plays relevant sounds.
   */
  setAlertState() {
    if (this.currentState !== this.STATES.ALERT) {
      this.soundManager.play("endbossClucking");
      this.soundManager.stop("endbossAngry");
    }
    this.currentState = this.STATES.ALERT;

    if (!this.introSoundPlayed) {
      this.soundManager.play("introEndboss");
      this.introSoundPlayed = true;
    }
  }

  /**
   * Sets the endboss to the walking state and plays relevant sounds.
   */
  setWalkingState() {
    if (this.currentState !== this.STATES.WALKING) {
      console.error(
        "State: WALKING - spiele 'endbossClucking', stoppe 'endbossAngry'"
      );
      this.soundManager.stop("endbossAngry");
      this.soundManager.play("endbossClucking");
    }
    this.currentState = this.STATES.WALKING;
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
   * Checks if the character is at the end and moves the endboss if so.
   */
  checkCharacterPositionAndMove() {
    if (this.character.x >= 6000) {
      this.moveTowardsCharacter();
    }
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
   * Moves the endboss depending on its current state.
   */
  moveDependingOnState() {
    if (this.isDead) return;

    switch (this.currentState) {
      case this.STATES.ATTACK:
        this.chargePlayer();
        break;
      case this.STATES.ALERT:
        this.moveTowardsCharacter(this.speedWalk);
        break;
      case this.STATES.WALKING:
        break;
    }
  }

  /**
   * Moves the endboss towards the character.
   * @param {number} [speed=this.speedWalk] - The speed to move.
   */
  moveTowardsCharacter(speed = this.speedWalk) {
    if (!this.character) return;
    const characterX = this.character.x;
    if (this.x > characterX) this.x -= speed;
    else if (this.x < characterX) this.x += speed;
  }

  /**
   * Hurts the endboss, reducing its health and triggering hurt state.
   * @param {number} [damage=10] - The amount of damage.
   */
  hurt(damage = 10) {
    const now = Date.now();
    if (now < this.hurtUntil || this.isDead) return;

    this.health -= damage;
    this.hurtUntil = now + 1000;
    this.soundManager.play("endbossHurt");

    if (this.health <= 0) {
      this.die();
    } else {
      this.soundManager.stop("endbossClucking");
      this.currentState = this.STATES.HURT;
    }
  }

  /**
   * Handles the death of the endboss, plays sounds, and triggers game win.
   */
  die() {
    if (this.isDead) return;
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

  /**
   * Charges at the player if in attack state.
   */
  chargePlayer() {
    const now = Date.now();
    if (now < this.chargeCooldown) return;

    const dx = this.character.x - this.x;
    const distance = Math.abs(dx);
    const direction = dx > 0 ? 1 : -1;

    if (distance > 30) this.x += direction * this.speedAttack;
    if (!this.isAboveGround() && Math.random() < 0.75)
      this.speedY = this.jumpForce;
    if (distance < 100) this.chargeCooldown = now + 2000;
  }
}
