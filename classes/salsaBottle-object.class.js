/**
 * Class representing a throwable salsa bottle.
 * Extends the ThrowableObject and handles bottle rotation, splash animation, and interaction with the game world.
 */
class SalsaBottle extends ThrowableObject {
  /**
   * Images for the bottle's rotation animation.
   * @type {string[]}
   */
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Images for the bottle splash animation.
   * @type {string[]}
   */
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Images for the bottle resting on the ground.
   * @type {string[]}
   */
  IMAGES_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Static image for the bottle.
   * @type {string[]}
   */
  IMAGE_BOTTLE = ["img/6_salsa_bottle/salsa_bottle.png"];

  /**
   * Reference to the game world, used for accessing sound manager and other game state.
   * @type {Object}
   */
  world;

  /**
   * Creates a new SalsaBottle instance.
   * @param {number} x - Initial horizontal position.
   * @param {number} y - Initial vertical position.
   * @param {boolean} otherDirection - If true, bottle is thrown in the opposite direction.
   * @param {Object} world - The game world context.
   */
  constructor(x, y, otherDirection, world) {
    super(x, y, 70, 70);
    this.world = world;
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.otherDirection = otherDirection;
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.loadImages(this.IMAGES_GROUND);
    console.log("SalsaBottle created:", this);

    this.isSplashing = false;
    this.isRemoved = false;

    this.throw();
  }

  /**
   * Sets the game world context.
   * @param {Object} world - The game world.
   */
  setWorld(world) {
    this.world = world;
  }

  /**
   * Starts the splash animation and removes the bottle after animation.
   */
  startSplashAndRemove() {
    this.splash();
  }

  /**
   * Initiates the throw behavior and starts the rotation animation.
   */
  throw() {
    super.throw();
    this.animateRotation();
  }

  /**
   * Animates the bottle rotation while flying.
   * Loops through rotation images until the bottle is no longer flying.
   */
  animateRotation() {
    let index = 0;
    const interval = setInterval(() => {
      if (!this.isFlying) {
        clearInterval(interval);
        return;
      }
      this.img = this.imageCache[this.IMAGES_ROTATION[index]];
      index = (index + 1) % this.IMAGES_ROTATION.length;
    }, 100);
  }

  /**
   * Handles the splash animation when the bottle hits the ground or an object.
   * Plays splash sound and changes image sequence accordingly.
   */
  splash() {
    this.isFlying = false;
    if (this.world?.soundManager) this.world.soundManager.play("bottleSplash");
    
    let index = 0;
    const interval = setInterval(() => {
      if (index >= this.IMAGES_SPLASH.length) {
        clearInterval(interval);
        this.setGroundImage();
        this.removeBottleFromWorld();
        return;
      }
      this.img = this.imageCache[this.IMAGES_SPLASH[index]];
      index++;
    }, 100);
  }

  /**
   * Plays the splash sound with a slight delay.
   */
  playSplashSound() {
    if (this.world?.soundManager) {
      setTimeout(() => this.world.soundManager.play("bottleSplash"), 50);
    }
  }

  /**
   * Sets the bottle image to one of the ground images randomly.
   */
  setGroundImage() {
    const index = Math.floor(Math.random() * this.IMAGES_GROUND.length);
    this.img = this.imageCache[this.IMAGES_GROUND[index]];
  }

  /**
   * Removes the bottle from the world's throwableObjects and enemies arrays.
   */
  removeBottleFromWorld() {
    this.removeFromArray(this.world?.throwableObjects, "throwableObjects");
    this.removeFromArray(this.world?.level?.enemies, "enemies");
  }

  /**
   * Helper method to remove this bottle from a given array in the world.
   * @param {Array} array - The array to remove from.
   * @param {string} name - The name of the array for logging purposes.
   */
  removeFromArray(array, name) {
    if (array) {
      const index = array.indexOf(this);
      if (index > -1) {
        console.log(`Bottle removed from world.${name}`);
        array.splice(index, 1);
      }
    }
  }
}
