class Chicken extends MoveableObject {
  constructor(
    imagePath,
    imageArray,
    imageDeadArray,
    width,
    height,
    speedRange,
    soundPath, // Adding parameter for sound file
    enemies = []
  ) {
    super();

    this.x = 200 + Math.random() * 5700;
    this.y = 370;
    this.speed = speedRange[0] + Math.random() * speedRange[1];
    this.height = height;
    this.width = width;
    this.IMAGES_WALKING = imageArray;
    this.IMAGES_DEAD = imageDeadArray;

    this.enemies = enemies;
    this.isDead = false; // Zustand, ob das Huhn tot ist
    this.isRemoved = false; // Zustand, ob das Huhn bereits entfernt wurde
    this.gameManager = gameManager; // Reference to GameManager

    this.imageCache = {};
    this.loadImage(imagePath);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.runningSound = new Audio(soundPath);
    this.runningSound.loop = true;

    this.userInteracted = false;
    this.isRunning = false;

    // Adding user interaction
    document.addEventListener("click", this.enableAudioPlayback.bind(this));
    document.addEventListener("keydown", this.enableAudioPlayback.bind(this));

    // Start animation
    this.animate();
  }

  enableAudioPlayback() {
    if (!this.userInteracted) {
      this.userInteracted = true;
      console.log("Audio playback enabled");
    }
  }

  moveLeft() {
    super.moveLeft();
    if (this.userInteracted && !this.isRunning) {
      this.runningSound.play();
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

  die() {
    if (this.isDead) {
      console.warn("Chicken is already dead:", this);
      return;
    }

    console.log("Chicken is dying...");
    this.isDead = true;
    clearInterval(this.walkingInterval);
    clearInterval(this.animationInterval);

    this.runningSound.pause();
    this.runningSound.currentTime = 0;
    this.isRunning = false;

    let frameIndex = 0;
    const deathInterval = setInterval(() => {
      if (frameIndex < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[frameIndex]];
        frameIndex++;
      } else {
        clearInterval(deathInterval);
        console.log("Chicken animation completed. Ready to remove.");
        this.removeEnemy(); // Richtiges Aufrufen der Methode
      }
    }, 100);
  }
}
