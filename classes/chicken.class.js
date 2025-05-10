class Chicken extends MoveableObject {
  constructor(
    imagePath,
    imageArray,
    imageDeadArray,
    width,
    height,
    speedRange
  ) {
    super();

    this.x = 200 + Math.random() * 5700;
    this.y = 370;
    this.speed = speedRange[0] + Math.random() * speedRange[1];
    this.height = height;
    this.width = width;
    this.IMAGES_WALKING = imageArray;
    this.IMAGES_DEAD = imageDeadArray;

    this.imageCache = {};
    this.loadImage(imagePath);

    this.loadImages(this.IMAGES_WALKING);
    this.animate();
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

  die(enemies, index) {
    console.log("Chicken is dying..."); // Debugging
    clearInterval(this.walkingInterval);
    clearInterval(this.animationInterval);
    this.playAnimation(this.IMAGES_DEAD);
    this.hitbox = null;

    setTimeout(() => {
        this.speed = 0;
        this.y += 5;

        // Entferne das Huhn aus dem Array
        if (enemies && typeof index === "number") {
            console.log("Removing chicken from enemies array...", this);
            enemies.splice(index, 1);
        }
    }, 500); // Wartezeit für die Todesanimation
}
}
