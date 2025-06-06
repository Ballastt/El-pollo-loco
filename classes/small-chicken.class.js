/**
 * Class representing a small chicken enemy.
 * Extends the Chicken class and initializes specific properties such as images, size, and position.
 */
class SmallChicken extends Chicken {
  /**
   * Creates a new SmallChicken instance with predefined images and settings.
   */
  constructor() {
    super(
      "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
      [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
      ],
      ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"],
      35,          // width
      35,          // height
      [0.25, 0.65],// hitbox offset scale or similar parameters
      "smallChickenWalking", // animation state name for walking
      "chickenDeath"         // animation state name for death
    );

    /**
     * Vertical position of the small chicken.
     * @type {number}
     */
    this.y = 380;
  }
}
