/**
 * Represents a status bar (e.g., health, coins, or throwables) that displays
 * the current percentage visually using a set of images.
 * 
 * @class
 */
class StatusBar extends DrawableObject {
  /**
   * Predefined sets of images for different types of status bars.
   * Each array contains images representing percentage states from 0 to 100.
   * @type {Object.<string, string[]>}
   * @static
   */
  static IMAGE_SETS = {
    health: [
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
    ],
    endboss: [
      "img/7_statusbars/2_statusbar_endboss/green/green0.png",
      "img/7_statusbars/2_statusbar_endboss/green/green20.png",
      "img/7_statusbars/2_statusbar_endboss/green/green40.png",
      "img/7_statusbars/2_statusbar_endboss/green/green60.png",
      "img/7_statusbars/2_statusbar_endboss/green/green80.png",
      "img/7_statusbars/2_statusbar_endboss/green/green100.png",
    ],
    throw: [
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
    ],
    coin: [
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    ],
  };

  /**
   * Creates a new StatusBar instance.
   * 
   * @param {string} type - The type of status bar (e.g., "health", "throw", "coin").
   * @param {number} x - The x-coordinate position of the status bar.
   * @param {number} y - The y-coordinate position of the status bar.
   * @param {number} width - The width of the status bar.
   * @param {number} height - The height of the status bar.
   * @param {boolean} [isReversed=false] - Whether the status bar's fill direction is reversed.
   *                                       For example, coins might fill upwards.
   * 
   * @throws {Error} Throws if the provided type does not have corresponding images defined.
   */
  constructor(type, x, y, width, height, isReversed = false) {
    super();
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isReversed = isReversed;

    // Select images based on the type
    this.images = StatusBar.IMAGE_SETS[type];
    if (!this.images) throw new Error(`StatusBar type "${type}" is not defined.`);
  
    this.loadImages(this.images);
    this.setPercentage(isReversed ? 0 : 100);
  }

  /**
   * Sets the current percentage of the status bar and updates the displayed image accordingly.
   * The percentage is clamped between 0 and 100.
   * 
   * @param {number} percentage - The new percentage value to set.
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(percentage, 100)); // Clamp between 0 and 100

    // Determine the appropriate image based on the current percentage
    let path = this.images[this.resolveImageIndex()];

    // Load the image if it is not already cached
    if (!this.imageCache[path]) this.loadImage(path);
    this.img = this.imageCache[path];

    if (!this.img) console.error(`Image not found for percentage: ${percentage}, path: ${path}`);
  }

  /**
   * Resolves the index of the image that corresponds to the current percentage.
   * The logic differs if the bar is reversed.
   * 
   * @returns {number} The index of the image to display.
   */
  resolveImageIndex() {
    if (this.isReversed) {
      // For reversed bars (e.g., coins) — images correspond to increasing fill
      if (this.percentage == 100) return 5;
      if (this.percentage > 60 && this.percentage <= 99) return 4;
      if (this.percentage > 40 && this.percentage <= 60) return 3;
      if (this.percentage > 20 && this.percentage <= 40) return 2;
      if (this.percentage > 0.1 && this.percentage <= 20) return 1;
      return 0;
    } else {
      // For normal bars (e.g., health) — images correspond to decreasing fill
      if (this.percentage == 100) return 5;
      if (this.percentage > 60 && this.percentage <= 99) return 4;
      if (this.percentage > 40 && this.percentage <= 60) return 3;
      if (this.percentage > 20 && this.percentage <= 40) return 2;
      if (this.percentage > 0.1 && this.percentage <= 20) return 1;
      return 0;
    }
  }
}
