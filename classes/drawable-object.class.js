/**
 * Base class for drawable objects with position, size, and image handling.
 */
class DrawableObject {
  /** @type {HTMLImageElement} The currently loaded image */
  img;

  /** @type {Object.<string, HTMLImageElement>} Cache for loaded images keyed by path */
  imageCache = {};

  /** @type {number} Horizontal position on the canvas */
  x = 0;

  /** @type {number} Vertical position on the canvas */
  y = 0;

  /** @type {number} Width of the drawable object */
  width = 50;

  /** @type {number} Height of the drawable object */
  height = 50;

  /**
   * Loads an image from the given path and assigns it to this.img.
   * @param {string} path - The file path or URL of the image to load.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads multiple images and caches them in imageCache.
   * @param {string[]} arr - Array of image paths to preload.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the current image on the canvas context at the object's position and size.
   * Only draws if the image is fully loaded.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    if (this.img instanceof HTMLImageElement && this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Draws the hitbox for debugging purposes if the object is a Character or Endboss.
   * Draws a red rectangle outlining the hitbox or the entire image if no hitbox is set.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawHitbox(ctx) {
    if (this instanceof Character || this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "red";

      if (this.hitbox) {
        ctx.rect(
          this.x + this.hitbox.offsetX,
          this.y + this.hitbox.offsetY,
          this.hitbox.width,
          this.hitbox.height
        );
      } else {
        ctx.rect(this.x, this.y, this.width, this.height);
      }

      ctx.stroke();
    }
  }
}
