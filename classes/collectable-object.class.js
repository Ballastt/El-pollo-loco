/**
 * Class representing a collectible object in the game.
 * Extends MoveableObject and provides basic properties like position, size, and hitbox.
 * 
 * @extends MoveableObject
 */
class CollectableObject extends MoveableObject {
  /**
   * Creates a collectible object at the specified position and size.
   * Initializes speed to zero (static object) and sets a default hitbox.
   * 
   * @param {number} x - The horizontal position of the object.
   * @param {number} y - The vertical position of the object.
   * @param {number} width - The width of the object.
   * @param {number} height - The height of the object.
   */
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0; // No movement

    /**
     * Hitbox for collision detection, can be overridden in subclasses.
     * @type {{offsetX: number, offsetY: number, width: number, height: number}}
     */
    this.hitbox = {
      offsetX: 0,
      offsetY: 0,
      width: width,
      height: height,
    };
  }

  /**
   * Loads images for the collectible object.
   * Delegates to the inherited loadImages method.
   * 
   * @param {string[]} imagePaths - Array of image paths to load.
   */
  loadCollectableImages(imagePaths) {
    this.loadImages(imagePaths);
  }
}
