/**
 * Class representing a collectible coin with animation.
 * Extends CollectableObject.
 * 
 * @extends CollectableObject
 */
class Coin extends CollectableObject {
  /**
   * Array of image paths used for the coin animation.
   * @type {string[]}
   */
  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Creates a new Coin instance at the specified position.
   * Loads the initial image, animation frames, and sets the hitbox.
   * Starts the coin animation.
   * 
   * @param {number} x - The horizontal position of the coin.
   * @param {number} y - The vertical position of the coin.
   */
  constructor(x, y) {
    super(x, y, 100, 100); // Pass size to CollectableObject
    this.loadImage("img/8_coin/coin_1.png");
    this.loadCollectableImages(this.IMAGES_COIN);

    /**
     * Hitbox for collision detection with offset and size.
     * @type {{offsetX: number, offsetY: number, width: number, height: number}}
     */
    this.hitbox = {
      offsetX: 30, // Horizontal offset for hitbox
      offsetY: 30, // Vertical offset for hitbox
      width: 40,
      height: 38,
    };

    this.animate();
  }

  /**
   * Starts the animation loop for the coin.
   * The animation cycles through the coin images every 400 milliseconds.
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 400);
  }
}
