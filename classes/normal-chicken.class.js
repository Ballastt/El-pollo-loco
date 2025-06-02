/**
 * Class representing a normal chicken enemy.
 * Extends the Chicken class and initializes with specific images, sizes, and animation settings.
 */
class NormalChicken extends Chicken {
  /**
   * Creates an instance of NormalChicken.
   * Initializes the walking and dead animation frames, size, hitbox, and animation names.
   */
  constructor() {
    super(
      "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
      [
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
      ],
      ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"],
      55,              // width of the chicken
      55,              // height of the chicken
      [0.15, 0.75],    // hitbox offsets [offsetX, offsetY] relative to the sprite
      "normalChickenWalking",  // name of the walking animation
      "chickenDeath"           // name of the death animation
    );

    /**
     * Vertical position on the canvas (y-coordinate).
     * @type {number}
     */
    this.y = 362;
  }
}
