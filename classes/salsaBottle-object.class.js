class SalsaBottle extends ThrowableObject {
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  IMAGES_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  IMAGE_BOTTLE = ["img/6_salsa_bottle/salsa_bottle.png"];

  world;

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

  setWorld(world) {
    this.world = world;
  }

  startSplashAndRemove() {
    this.splash();
  }

  throw() {
    super.throw();
    this.animateRotation();
  }

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

  splash() {
    this.isFlying = false;

    // Sound sofort abspielen
    if (this.world?.soundManager) {
      this.world.soundManager.play("bottleSplash");
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index >= this.IMAGES_SPLASH.length) {
        clearInterval(interval);
        this.setGroundImage();
        this.removeBottleFromWorld();
        return;
      }
      console.log(`Splash frame ${index} for bottle:`, this);
      this.img = this.imageCache[this.IMAGES_SPLASH[index]];
      index++;
    }, 100);
  }

  playSplashSound() {
    if (this.world?.soundManager) {
      setTimeout(() => this.world.soundManager.play("bottleSplash"), 50);
    }
  }

  setGroundImage() {
    const index = Math.floor(Math.random() * this.IMAGES_GROUND.length);
    this.img = this.imageCache[this.IMAGES_GROUND[index]];
  }

  removeBottleFromWorld() {
    console.log("Removing bottle from world:", this);

    this.removeFromArray(this.world?.throwableObjects, "throwableObjects");
    this.removeFromArray(this.world?.level?.enemies, "enemies");
  }

  removeFromArray(array, name) {
    if (array) {
      const index = array.indexOf(this);
      if (index > -1) {
        console.log(`Flasche aus world.${name} entfernt`);
        array.splice(index, 1);
      }
    }
  }
}
