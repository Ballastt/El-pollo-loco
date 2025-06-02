/**
 * Class representing a moveable object that extends DrawableObject.
 * Handles position, movement, gravity, animation, collision detection, and health.
 */
class MoveableObject extends DrawableObject {
  currentImage = 0;
  speed = 0.55;
  otherDirection = false; 
  speedY = 0;
  acceleration = 2.5;
  health = 100;
  isDead = false;
  lastHit = 0;
  groundY;
  paused = false;


   /**
   * Applies gravity to the object, updating its vertical position over time.
   * Stops movement when object reaches the ground.
   */
  applyGravity() {
    const tolerance = 2; 
    this.gravityInterval = setInterval(() => {
      if (!this.paused) {
        if (this.isAboveGround() || this.speedY > 0) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        } else if (this.y >= this.groundY - tolerance) {
          this.y = this.groundY; 
          this.speedY = 0; 
        }
      }
    }, 1000 / 25);
  }

   /**
   * Checks if the object is above the ground.
   * @returns {boolean} True if above ground, false otherwise.
   */
  isAboveGround() {
    const tolerance = 5;
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < this.groundY - tolerance;
    }
  }

  /**
   * Plays animation by cycling through provided image paths.
   * @param {string[]} images - Array of image paths for animation frames.
   */
  playAnimation(images) {
    if (!this.paused) {
      // Prüfen, ob pausiert
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
  }

  /**
   * Moves the object to the right by its speed.
   */
  moveRight() {
    if (!this.paused) {
      this.x += this.speed;
      this.otherDirection = false;
    }
  }

   /**
   * Moves the object to the left by its speed.
   */
  moveLeft() {
    if (!this.paused) {
      this.x -= this.speed;
      this.otherDirection = true;
    }
  }

   /**
   * Pauses all movements and animations of this object.
   */
  pause() {
    this.paused = true;
    console.log(`${this.constructor.name} paused`);
  }

   /**
   * Resumes movements and animations if paused.
   */
  resume() {
    this.paused = false;
    console.log(`${this.constructor.name} resumed`);
  }

  /**
   * Checks if this object is colliding with another movable object.
   * Takes into account hitboxes if defined.
   * @param {MoveableObject} mo - The other object to check collision with.
   * @returns {boolean} True if colliding, false otherwise.
   */
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

    /**
   * Makes the object jump by setting vertical speed.
   */
  jump() {
    if (!this.paused) {
      this.speedY = 34;
    }
  }

  /**
   * Decreases health by damage amount and triggers death if health falls below zero.
   * @param {number} damage - Amount of damage to apply.
   */
  hit(damage) {
    this.health -= damage;
    if (this.health < 0) {
      this.health = 0; 
      this.die();
    }
  }

  /**
   * Handles object's death, clears gravity interval and marks as dead.
   */
  die() {
    if (!this.isDead) {
      this.isDead = true;

      clearInterval(this.gravityInterval); 
      console.log(`${this.constructor.name} ist gestorben!`);
    }
  }
}
