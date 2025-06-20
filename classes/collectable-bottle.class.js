/**
 * Class representing a collectible bottle.
 * Extends CollectableObject.
 *
 * @extends CollectableObject
 */
class CollectableBottle extends CollectableObject {
  /**
   * Creates a new CollectableBottle instance at the specified position.
   * Loads the bottle image and sets the hitbox.
   *
   * @param {number} x - The horizontal position of the bottle.
   * @param {number} y - The vertical position of the bottle.
   * @param {Object} world - Reference to the game world (optional, for context).
   */
  constructor(x, y, world) {
    super(x, y, 70, 50); 
    this.world = world;
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png"); 

    this.initHitbox(); 
  }

  /**
   * Hitbox for collision detection with offset and size.
   * @type {{offsetX: number, offsetY: number, width: number, height: number}}
   */
  initHitbox() {
    this.hitbox = {
      offsetX: 23,
      offsetY: 6,
      width: 25,
      height: 40,
    };
  }
}
