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
   * Draws the hitbox as a semi-transparent red rectangle.
   * Only for debugging – remove or disable for production.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawHitbox(ctx) {
    const bounds = this.getHitboxBounds?.();
    if (!bounds) return;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      bounds.left,
      bounds.top,
      bounds.right - bounds.left,
      bounds.bottom - bounds.top
    );
    ctx.restore();
  }

  /**
   * Returns the hitbox bounds of the object.
   * Defaults to the object's full bounds if no custom hitbox is defined.
   * @returns {{ left: number, right: number, top: number, bottom: number, centerX: number, centerY: number }}
   */
  getHitboxBounds() {
    const offsetX = this.hitbox?.offsetX || 0;
    const offsetY = this.hitbox?.offsetY || 0;
    const width = this.hitbox?.width || this.width;
    const height = this.hitbox?.height || this.height;

    const left = this.x + offsetX;
    const top = this.y + offsetY;
    return {
      left,
      top,
      right: left + width,
      bottom: top + height,
      centerX: left + width / 2,
      centerY: top + height / 2,
    };
  }
}
