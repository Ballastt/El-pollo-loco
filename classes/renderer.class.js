class Renderer {
  constructor(world) {
    this.world = world;
    this.ctx = world.ctx;
    this.canvas = world.canvas;
  }

  draw() {
    const w = this.world;
    w.ctx.clearRect(0, 0, w.canvas.width, w.canvas.height);

    // Enable collection only after 1 second delay
    if (!w.allowCollection && Date.now() - w.startTime > 1000) {
      w.allowCollection = true;
    }

    if (w.allowCollection) {
      w.checkCoinCollection();
      w.checkBottleCollection();
    }

    // Kamerabewegung nur bis zum Levelende
    if (w.camera_x < w.level_end_x - w.canvas.width) {
      if (w.keyboard.RIGHT) {
        w.camera_x += 1;
      }
    }

    w.ctx.translate(w.camera_x, 0); // Kameradrehung initial

    // Bewegliche Objekte zeichnen
    this.addObjectToMap(w.backgroundObjects);
    this.addObjectToMap(w.level.coins);
    this.addObjectToMap(w.level.bottles);
    this.addObjectToMap(w.level.clouds);
    this.addToMap(w.character);
    this.addToMap(w.endboss);
    this.addObjectToMap(w.level.enemies);
    this.addObjectToMap(w.throwableObjects);

    // Kamera zurücksetzen
    w.ctx.translate(-w.camera_x, 0);

    // UI-Elemente zeichnen
    this.addToMap(w.healthBar);
    this.addToMap(w.throwBar);
    this.addToMap(w.coinBar);

    // Nächster Frame
    requestAnimationFrame(() => this.draw());
  }

  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);

    mo.draw(this.ctx);
    mo.drawHitbox(this.ctx);

    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
