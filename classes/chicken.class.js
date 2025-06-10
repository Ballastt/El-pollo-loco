class Chicken extends MoveableObject {
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

    this.world = world;
    this.enemies = enemies;
    this.gameManager = gameManager;
    this.soundManager = soundManager;

    this.walkSoundKey = walkSoundKey;
    this.deathSoundKey = deathSoundKey;

    this.initDimensions(width, height, speedRange);
    this.initFlags();
    this.initImages(imagePath, imageArray, imageDeadArray);

    this.animate();
  }

  initDimensions(width, height, speedRange) {
    this.width = width;
    this.height = height;
    this.x = 200 + Math.random() * 6200;
    this.y = 370;
    this.speed = speedRange[0] + Math.random() * speedRange[1];
  }

  initFlags() {
    this.isDead = false;
    this.isRemoved = false;
    this.isRunning = false;
  }

  initImages(imagePath, imageArray, imageDeadArray) {
    this.IMAGES_WALKING = imageArray;
    this.IMAGES_DEAD = imageDeadArray;
    this.imageCache = {};

    this.loadImage(imagePath);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  moveLeft() {
    if (this.isDead) return;

    super.moveLeft();
    if (!this.isRunning) {
      this.soundManager.play(this.walkSoundKey);
      this.isRunning = true;
    }
  }

  animate() {
    this.walkingInterval = setInterval(() => {
      this.moveLeft();
      this.otherDirection = false;
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  removeEnemy() {
    if (this.isRemoved) return;

    const index = this.enemies.indexOf(this);
    if (index > -1) {
      this.enemies.splice(index, 1);
      this.isRemoved = true;
    }
  }

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
        }, 500); // 1 Sekunde Verzögerung
      }
    }, 200); // Verlängertes Intervall für bessere Sichtbarkeit
  }

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
