class Renderer {
  constructor(world) {
    this.world = world;
  }

  draw() {
    const w = this.world;
    w.ctx.clearRect(0, 0, w.canvas.width, w.canvas.height);

    // Enable collection only after 1 second delay
    if (!this.allowCollection && Date.now() - this.startTime > 1000) {
      this.allowCollection = true;
    }

    if (this.allowCollection) {
      this.checkCoinCollection();
      this.checkBottleCollection();
    }

    // Kamerabewegung nur bis zum Levelende
    if (this.camera_x < this.level_end_x - this.canvas.width) {
      if (this.keyboard.RIGHT) {
        this.camera_x += 1;
      }
    }

    this.ctx.translate(this.camera_x, 0); // Kameradrehung initial

    // Bewegliche Objekte zeichnen
    this.addObjectToMap(this.backgroundObjects);
    this.addObjectToMap(this.level.coins);
    this.addObjectToMap(this.level.bottles);
    this.addObjectToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addToMap(this.endboss);
    this.addObjectToMap(this.level.enemies);
    this.addObjectToMap(this.throwableObjects);

    // Kamera zurücksetzen
    this.ctx.translate(-this.camera_x, 0);

    // UI-Elemente zeichnen
    this.addToMap(this.healthBar);
    this.addToMap(this.throwBar);
    this.addToMap(this.coinBar);

    // Nächster Frame
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Adds an array of objects to the map (draws them).
   * @param {Array} objects - The objects to add.
   */
  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Draws a single object to the map, handling direction and hitbox.
   * @param {MoveableObject} mo - The object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);

    mo.draw(this.ctx);
    mo.drawHitbox(this.ctx);

    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Flips the image horizontally for drawing mirrored objects.
   * @param {MoveableObject} mo - The object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the image after flipping.
   * @param {MoveableObject} mo - The object to restore.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
