/**
 * Represents an object that can be thrown and moves with gravity.
 * Extends MoveableObject to inherit movement and drawable features.
 * 
 * @extends MoveableObject
 */
class ThrowableObject extends MoveableObject {
  /**
   * Creates a throwable object with specified position and size.
   * 
   * @param {number} x - Initial horizontal position.
   * @param {number} y - Initial vertical position.
   * @param {number} width - Width of the object.
   * @param {number} height - Height of the object.
   */
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    /** @type {number} Horizontal speed */
    this.speedX = 0;

    /** @type {number} Vertical speed */
    this.speedY = 0;

    /** @type {boolean} Indicates whether the object is currently flying */
    this.isFlying = false;
  }

  /**
   * Applies gravity to the vertical speed of the object,
   * increasing speedY by 1 to simulate acceleration downward.
   */
  applyGravity() {
    this.speedY += 1;
  }

  /**
   * Checks if the object has hit the ground.
   * If the vertical position `y` is at or below ground level (370),
   * the splash effect is triggered and the throwing movement stops.
   */
  checkGroundCollision() {
    if (this.y >= 370) {
      this.splash();
      clearInterval(this.throwInterval);
    }
  }

  /**
   * Initiates the throwing movement of the object.
   * Sets initial horizontal and vertical speeds based on direction.
   * Starts a timer to update the position and apply gravity.
   */
  throw() {
    this.isFlying = true;
    this.speedX = this.otherDirection ? -10 : 10;
    this.speedY = -20;

    this.throwInterval = setInterval(() => {
      if (this.isFlying) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.applyGravity();
        this.checkGroundCollision();
      }
    }, 25);
  }

  /**
   * Placeholder for splash effect when the object hits the ground.
   * Should be implemented in subclasses.
   */
  splash() {
    // To be implemented in subclasses
  }
}
