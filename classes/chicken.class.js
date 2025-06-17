/**
 * Represents a chicken enemy in the game.
 * Handles movement, animation, death, and removal from the game world.
 * @extends MoveableObject
 */
class Chicken extends MoveableObject {
  /**
   * Creates a new Chicken instance.
   * @param {string} imagePath - Path to the default chicken image.
   * @param {string[]} imageArray - Array of walking animation image paths.
   * @param {string[]} imageDeadArray - Array of dead animation image paths.
   * @param {number} width - Width of the chicken.
   * @param {number} height - Height of the chicken.
   * @param {number[]} speedRange - Array [min, max] for random speed.
   * @param {string} walkSoundKey - Sound key for walking.
   * @param {string} deathSoundKey - Sound key for death.
   * @param {Chicken[]} [enemies=[]] - Reference to the enemies array.
   * @param {World} [world=null] - Reference to the game world.
   */
  constructor(
    imagePath,
    imageArray,
    imageDeadArray,
    width,
    height,
    speedRange,
    walkSoundKey,
    deathSoundKey,
    enemies = [],
    world = null
  ) {
    super();

    /**
     * Reference to the game world.
     * @type {World}
     */
    this.world = world;

    /**
     * Reference to the enemies array.
     * @type {Chicken[]}
     */
    this.enemies = enemies;

    /**
     * Reference to the game manager.
     * @type {GameManager}
     */
    this.gameManager = gameManager;

    /**
     * Reference to the sound manager.
     * @type {SoundManager}
     */
    this.soundManager = soundManager;

    /**
     * Sound key for walking.
     * @type {string}
     */
    this.walkSoundKey = walkSoundKey;

    /**
     * Sound key for death.
     * @type {string}
     */
    this.deathSoundKey = deathSoundKey;

    this.initDimensions(width, height, speedRange);
    this.initFlags();
    this.initImages(imagePath, imageArray, imageDeadArray);

    this.animate();
  }

  /**
   * Initializes the chicken's dimensions and speed.
   * @param {number} width
   * @param {number} height
   * @param {number[]} speedRange
   */
  initDimensions(width, height, speedRange) {
    this.width = width;
    this.height = height;
    this.x = 200 + Math.random() * 6200;
    this.speed = speedRange[0] + Math.random() * speedRange[1];
  }

  /**
   * Initializes chicken state flags.
   */
  initFlags() {
    /**
     * Indicates if the chicken is dead.
     * @type {boolean}
     */
    this.isDead = false;

    /**
     * Indicates if the chicken has been removed from the game.
     * @type {boolean}
     */
    this.isRemoved = false;

    /**
     * Indicates if the chicken is currently running (for sound).
     * @type {boolean}
     */
    this.isRunning = false;
  }

  /**
   * Initializes chicken images for walking and dead states.
   * @param {string} imagePath
   * @param {string[]} imageArray
   * @param {string[]} imageDeadArray
   */
  initImages(imagePath, imageArray, imageDeadArray) {
    /**
     * Walking animation images.
     * @type {string[]}
     */
    this.IMAGES_WALKING = imageArray;

    /**
     * Dead animation images.
     * @type {string[]}
     */
    this.IMAGES_DEAD = imageDeadArray;

    /**
     * Image cache for loaded images.
     * @type {Object}
     */
    this.imageCache = {};

    this.loadImage(imagePath);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Moves the chicken to the left if not dead, and plays walking sound.
   */
  moveLeft() {
    if (this.isDead) return;

    super.moveLeft();
    if (!this.isRunning) {
      this.soundManager.play(this.walkSoundKey);
      this.isRunning = true;
    }
  }

  /**
   * Starts the movement and animation intervals for the chicken.
   */
  animate() {
    this.walkingInterval = setInterval(() => {
      this.moveLeft();
      this.otherDirection = false;
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  /**
   * Removes the chicken from the enemies array and marks as removed.
   */
  removeEnemy() {
    if (this.isRemoved) return;

    const index = this.enemies.indexOf(this);
    if (index > -1) {
      this.enemies.splice(index, 1);
      this.isRemoved = true;
    }
  }

  /**
   * Plays the death animation for the chicken and removes it after.
   */
  deathAnimationChicken() {
    let frameIndex = 0;
    const deathInterval = setInterval(() => {
      if (frameIndex < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[frameIndex]];
        frameIndex++;
      } else {
        clearInterval(deathInterval);

        setTimeout(() => {
          this.removeEnemy();
        }, 300);
      }
    }, 200);
  }

  /**
   * Handles the death of the chicken: stops intervals, plays sound, and triggers death animation.
   */
  die() {
    if (this.isDead) return console.warn("Chicken is already dead:", this);

    this.isRemoving = true;
    this.isDead = true; // direkt synchron setzen

    clearInterval(this.walkingInterval);
    clearInterval(this.animationInterval);

    this.soundManager.play(this.deathSoundKey);

    this.isRunning = false;
    this.deathAnimationChicken();
  }
}
