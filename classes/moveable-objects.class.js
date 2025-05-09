class MoveableObject extends DrawableObject {
  currentImage = 0;
  speed = 0.55;
  otherDirection = false; //standardmäßg mal falsch
  speedY = 0;
  acceleration = 2.5;
  health = 100;
  isDead = false;
  lastHit = 0;
  groundY;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.y = this.groundY;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < this.groundY;
    }
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  //Schablone (wie ein JSON)
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  //character isColliding(Chicken)
  isColliding(mo) {
    const thisHitbox = this.hitbox
      ? {
          x: this.x + this.hitbox.offsetX,
          y: this.y + this.hitbox.offsetY,
          width: this.hitbox.width,
          height: this.hitbox.height,
        }
      : { x: this.x, y: this.y, width: this.width, height: this.height };

    const moHitbox = mo.hitbox
      ? {
          x: mo.x + mo.hitbox.offsetX,
          y: mo.y + mo.hitbox.offsetY,
          width: mo.hitbox.width,
          height: mo.hitbox.height,
        }
      : { x: mo.x, y: mo.y, width: mo.width, height: mo.height };

    return (
      thisHitbox.x + thisHitbox.width > moHitbox.x &&
      thisHitbox.y + thisHitbox.height > moHitbox.y &&
      thisHitbox.x < moHitbox.x + moHitbox.width &&
      thisHitbox.y < moHitbox.y + moHitbox.height
    );
  }

  jump() {
    this.speedY = 34;
  }

  // Allgemeine Trefferlogik
  hit(damage) {
    this.health -= damage;

    // Überprüfen, ob das Objekt sterben soll
    if (this.health < 0) {
      this.health = 0; // Gesundheit darf nicht negativ sein
      this.die();
    }
    console.log(
      `${this.constructor.name} getroffen! Gesundheit: ${this.health}`
    );
  }

  // Allgemeine Logik für den Tod
  die() {
    if (!this.isDead) {
      this.isDead = true;
      console.log(`${this.constructor.name} ist gestorben!`);
    }
  }
}
