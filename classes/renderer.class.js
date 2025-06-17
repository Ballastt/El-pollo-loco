/**
 * Handles all rendering logic for the game world.
 * Responsible for drawing the background, characters, enemies, UI elements, and managing camera translation.
 */
class Renderer {
  /**
   * Creates a new Renderer instance.
   * @param {World} world - The game world to render.
   */
  constructor(world) {
    /** @type {World} */
    this.world = world;

    /** @type {CanvasRenderingContext2D} */
    this.ctx = world.ctx;

    /** @type {HTMLCanvasElement} */
    this.canvas = world.canvas;

    /** @type {Endboss} */
    this.endboss = world.endboss;

    /** @type {boolean} Whether rendering is currently active. */
    this.isDrawing = false;
  }

  /**
   * Starts the drawing loop for the game world.
   * Uses `requestAnimationFrame` to render each frame.
   */
  draw() {
    if (!this.isDrawing) return;

    const w = this.world;
    w.ctx.clearRect(0, 0, w.canvas.width, w.canvas.height);

    // Allow item collection after 1 second
    if (!w.allowCollection && Date.now() - w.startTime > 1000) {
      w.allowCollection = true;
    }

    if (w.allowCollection) {
      w.checkCoinCollection();
      w.checkBottleCollection();
    }

    // Move camera if not at level end
    if (w.camera_x < w.level_end_x - w.canvas.width) {
      if (w.keyboard.RIGHT) {
        w.camera_x += 1;
      }
    }

    w.ctx.save();
    w.ctx.translate(w.camera_x, 0);

    // Draw all world elements
    this.addObjectToMap(w.backgroundObjects);
    this.addObjectToMap(w.level.coins);
    this.addObjectToMap(w.level.bottles);
    this.addObjectToMap(w.level.clouds);
    this.addToMap(w.character);
    this.addToMap(w.endboss);
    this.addObjectToMap(w.level.enemies);
    this.addObjectToMap(w.throwableObjects);

    // Debug hitboxes
    this.world.character.drawHitbox(this.ctx);
    this.world.level.enemies.forEach((e) => e.drawHitbox?.(this.ctx));

    w.ctx.restore();

    // Draw UI (not affected by camera)
    this.addToMap(w.healthBar);
    this.addToMap(w.throwBar);
    this.addToMap(w.coinBar);

    const distanceToBoss = Math.abs(w.character.x - w.endboss.x);
    if (!w.endbossEncounterStarted && distanceToBoss < 500) {
      w.endbossEncounterStarted = true;
    }

    if (w.endbossHealthBar && w.endbossEncounterStarted) {
      this.addToMap(w.endbossHealthBar);
    }

    requestAnimationFrame(() => this.draw());
  }

  /**
   * Adds an array of objects to the render queue.
   * @param {Array<DrawableObject>} objects - The objects to draw.
   */
  addObjectToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Draws a single object, flipping it if it faces left.
   * @param {DrawableObject} mo - The drawable object.
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);

    mo.draw(this.ctx);

    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Applies a horizontal flip transformation before drawing the object.
   * @param {DrawableObject} mo - The object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Reverses the horizontal flip transformation after drawing.
   * @param {DrawableObject} mo - The object to restore.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Starts the renderer's drawing loop.
   */
  start() {
    if (this.isDrawing) return;
    this.isDrawing = true;
    this.draw();
  }

  /**
   * Stops the renderer's drawing loop.
   */
  stop() {
    this.isDrawing = false;
  }
}
