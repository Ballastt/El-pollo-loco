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

    this.x = 200 + Math.random() * 6200;
    this.y = 370;
    this.speed = speedRange[0] + Math.random() * speedRange[1];
    this.height = height;
    this.width = width;
    this.IMAGES_WALKING = imageArray;
    this.IMAGES_DEAD = imageDeadArray;

    this.enemies = enemies;
    this.isDead = false; 
    this.isRemoved = false; 
    this.gameManager = gameManager; 
    this.soundManager = soundManager;
    this.world = world; 

    this.walkSoundKey = walkSoundKey;
    this.deathSoundKey = deathSoundKey;

    this.imageCache = {};
    this.loadImage(imagePath);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.isRunning = false;
    this.animate();
  }

  moveLeft() {
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
    if (this.isRemoved) {
      console.warn("Enemy already removed:", this);
      return;
    }

    console.log("removeEnemy wurde aufgerufen:", this);
    const index = this.enemies.indexOf(this);
    console.log("Enemy index in array:", index);

    if (index > -1) {
      const removedEnemy = this.enemies.splice(index, 1)[0];
      console.log(`Removed enemy:`, removedEnemy);
      this.isRemoved = true; // Markiere das Huhn als entfernt
    } else {
      console.error("Enemy not found in the array!");
    }
    console.log("Enemies array after removal:", this.enemies);
  }

  deathAnimationChicken() {
    let frameIndex = 0;
    const deathInterval = setInterval(() => {
      if (frameIndex < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[frameIndex]];
        frameIndex++;
      } else {
        clearInterval(deathInterval);
        console.log("Chicken animation completed. Ready to remove.");

        setTimeout(() => {
          this.removeEnemy();
        }, 500); // 1 Sekunde Verzögerung
      }
    }, 200); // Verlängertes Intervall für bessere Sichtbarkeit
  }

  die() {
    if (this.isDead) {
      console.warn("Chicken is already dead:", this);
      return;
    }

    console.log("Chicken is dying...");
    this.isDead = true;
    clearInterval(this.walkingInterval);
    clearInterval(this.animationInterval);

    this.soundManager.play(this.deathSoundKey);
    this.isRunning = false;
    this.deathAnimationChicken();
  }
}
