/**
 * Class representing a cloud that moves slowly from right to left.
 * Extends the MoveableObject class.
 * 
 * @extends MoveableObject
 */
class Cloud extends MoveableObject {
  /**
   * Creates a new Cloud instance with random position and speed.
   * Loads the cloud image and starts its animation.
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    /** @type {number} Width of the cloud in pixels */
    this.width = 600;

    /** @type {number} Height of the cloud in pixels */
    this.height = 400;

    /** @type {number} Initial horizontal position (random between 0 and 6000) */
    this.x = Math.random() * 6000;

    /** @type {number} Initial vertical position (random between 0 and 40) */
    this.y = 0 + Math.random() * 40;

    /** @type {number} Speed of cloud movement to the left */
    this.speed = 0.15 + Math.random() * 0.3;

    this.animate();
  }

  /**
   * Animates the cloud movement by moving it left continuously.
   * Resets the position to the right side once it leaves the visible screen.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();

      if (this.x + this.width < 0) {
        this.x = 6000;
        this.y = 0 + Math.random() * 40; 
      }
    }, 1000 / 60); 
  }
}
