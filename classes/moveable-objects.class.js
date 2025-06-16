/**
 * Class representing a moveable object that extends DrawableObject.
 * Handles movement, gravity, animation, collision detection, health, and pause logic.
 * @extends DrawableObject
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
   * Applies gravity to the object.
   * Continuously decreases vertical speed and updates vertical position.
   * Stops when the object reaches the ground.
   */
  applyGravity() {
    if (this.gravityInterval) clearInterval(this.gravityInterval);

    this.gravityInterval = setInterval(() => {
      if (!this.paused) {
        this.isAboveGround() || this.speedY > 0
          ? this.applyGravityStep()
          : this.landIfOnGround();
      }
    }, 1000 / 25);
  }

  /**
   * Applies one step of vertical acceleration.
   * Called when object is in the air.
   */
  applyGravityStep() {
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
  }

   /**
   * Snaps object to ground level and resets vertical speed.
   * Called when falling should stop.
   */
  landIfOnGround() {
    const tolerance = 2;
    if (this.y >= this.groundY - tolerance) {
      this.y = this.groundY;
      this.speedY = 0;
    }
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
  }

  /**
   * Resumes movements and animations if paused.
   */
  resume() {
    this.paused = false;
  }

  /**
   * Checks if this object is colliding with another movable object.
   * Takes into account hitboxes if defined.
   * @param {MoveableObject} mo - The other object to check collision with.
   * @returns {boolean} True if colliding, false otherwise.
   */
  getHitbox() {
    return this.hitbox
      ? {
          x: this.x + this.hitbox.offsetX,
          y: this.y + this.hitbox.offsetY,
          width: this.hitbox.width,
          height: this.hitbox.height,
        }
      : { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  /**
   * Checks for collision with another object.
   * @param {MoveableObject} mo
   * @returns {boolean}
   */
  isColliding(mo) {
    const a = this.getHitbox();
    const b = mo.getHitbox();
    return (
      a.x + a.width > b.x &&
      a.y + a.height > b.y &&
      a.x < b.x + b.width &&
      a.y < b.y + b.height
    );
  }

  /**
   * Makes the object jump by setting vertical speed.
   */
  jump() {
    if (!this.paused && !this.isAboveGround()) {
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

  /** Resets key properties to initial state. */
  reset() {
    this.health = 100;
    this.speedY = 0;
    this.paused = false;
    this.isDead = false;
    this.currentImage = 0;
  }

   /** Stops movement/animation logic. */
  stop() {
    this.paused = true;
  }

  /**
   * Handles object's death, clears gravity interval and marks as dead.
   */
  die() {
    if (!this.isDead) {
      this.isDead = true;
      clearInterval(this.gravityInterval);
    }
  }
}
