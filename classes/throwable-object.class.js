class ThrowableObject extends MoveableObject {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.isFlying = false;
  }

  applyGravity() {
    this.speedY += 1; // Schwerkraft anwenden
  }

  checkGroundCollision() {
    if (this.y >= 370) {
      // 370 ist die Bodenhöhe
      this.splash();
      clearInterval(this.throwInterval); // Stoppe die Bewegung
    }
  }

  throw() {
    this.isFlying = true;
    this.speedX = this.otherDirection ? -10 : 10;
    this.speedY = -20;

    // Intervall für die Bewegungslogik
    this.throwInterval = setInterval(() => {
      if (this.isFlying) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.applyGravity(); // Schwerkraft anwenden
        this.checkGroundCollision();
      }
    }, 25);
  }
}
