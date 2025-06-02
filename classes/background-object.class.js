/**
 * Class representing a background object that moves with the game world.
 * Extends the MoveableObject class.
 * 
 * @extends MoveableObject
 */
class BackgroundObject extends MoveableObject {
  /** @type {number} Width of the background object in pixels */
  width = 720;

  /** @type {number} Height of the background object in pixels */
  height = 480;

  /**
   * Creates a new BackgroundObject instance.
   * Loads the image and sets the initial position.
   *
   * @param {string} imagePath - The path to the background image.
   * @param {number} x - The initial horizontal position of the background object.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height; // Aligns the bottom of the background object to y=480
  }
}
