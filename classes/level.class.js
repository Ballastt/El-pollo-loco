/**
 * Represents a game level containing enemies, clouds, background objects, coins, and bottles.
 */
class Level {
  /** @type {Array} Array of enemy objects in the level */
  enemies;

  /** @type {Array} Array of cloud objects in the level */
  clouds;

  /** @type {Array} Array of background objects in the level */
  backgroundObjects;

  /** @type {Array} Array of coin objects in the level */
  coins;

  /** @type {Array} Array of bottle objects in the level */
  bottles;

  /** @type {number} The horizontal position representing the end of the level */
  level_end_x = 6800;

  /** @type {number} Total number of coins in the level */
  totalCoins = 0;

  /** @type {number} Total number of bottles in the level */
  totalBottles = 0;

  /**
   * Creates a new Level.
   * @param {Array} enemies - List of enemy objects.
   * @param {Array} clouds - List of cloud objects.
   * @param {Array} backgroundObjects - List of background objects.
   * @param {Array} coins - List of coin objects.
   * @param {Array} bottles - List of bottle objects.
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;

    // Automatically set the totals
    this.totalCoins = coins.length;
    this.totalBottles = bottles.length;
  }

  /**
   * Regenerates the enemies in the level.
   */
  regenerateEnemies() {
    this.enemies = generateEnemies();
  }
}
