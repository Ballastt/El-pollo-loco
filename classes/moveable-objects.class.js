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
  paused = false;

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (!this.paused) {
        if (this.isAboveGround() || this.speedY > 0) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        } else {
          this.y = this.groundY;
          this.speedY = 0;
        }
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
    if (!this.paused) {
      // Prüfen, ob pausiert
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
  }

  //Schablone (wie ein JSON)
  moveRight() {
    if (!this.paused) {
      this.x += this.speed;
      this.otherDirection = false;
    }
  }

  moveLeft() {
    if (!this.paused) {
      this.x -= this.speed;
      this.otherDirection = true;
    }
  }

  pause() {
    this.paused = true;
    console.log(`${this.constructor.name} paused`);
  }

  resume() {
    this.paused = false;
    console.log(`${this.constructor.name} resumed`);
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
    if (!this.paused) {
      this.speedY = 34;
    }
  }

  // Allgemeine Trefferlogik
  hit(damage) {
    this.health -= damage;

    // Überprüfen, ob das Objekt sterben soll
    if (this.health < 0) {
      this.health = 0; // Gesundheit darf nicht negativ sein
      this.die();
    }
  }

  // Allgemeine Logik für den Tod
  die() {
    if (!this.isDead) {
      this.isDead = true;
    
      clearInterval(this.gravityInterval); // Schwerkraft beenden
      console.log(`${this.constructor.name} ist gestorben!`);
    }
  }
}
