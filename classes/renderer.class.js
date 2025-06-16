class Renderer {
  constructor(world) {
    this.world = world;
    this.ctx = world.ctx;
    this.canvas = world.canvas;
    this.endboss = world.endboss;
    this.isDrawing = false;
  }

  draw() {
    if (!this.isDrawing) return;

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

    // Camera movement
    if (w.camera_x < w.level_end_x - w.canvas.width) {
      if (w.keyboard.RIGHT) {
        w.camera_x += 1;
      }
    }

    // Use save/restore for camera
    w.ctx.save();
    w.ctx.translate(w.camera_x, 0);

    // Draw objects
    this.addObjectToMap(w.backgroundObjects);
    this.addObjectToMap(w.level.coins);
    this.addObjectToMap(w.level.bottles);
    this.addObjectToMap(w.level.clouds);
    this.addToMap(w.character);
    this.addToMap(w.endboss);
    this.addObjectToMap(w.level.enemies);
    this.addObjectToMap(w.throwableObjects);

    // In drawWorld() oder drawObjects(), temporär hinzufügen:
    this.world.character.drawHitbox(this.ctx);
    this.world.level.enemies.forEach((e) => e.drawHitbox?.(this.ctx));

    w.ctx.restore();

    // UI elements (drawn without camera translation)
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

  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);

    mo.draw(this.ctx);
    // mo.drawHitbox(this.ctx); // Removed for performance

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

  start() {
    if (this.isDrawing) return;
    this.isDrawing = true;
    console.log("[Renderer] start");
    this.draw();
  }

  stop() {
    this.isDrawing = false;
    console.log("[Renderer] stop");
  }
}
