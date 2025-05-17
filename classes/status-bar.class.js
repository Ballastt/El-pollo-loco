class StatusBar extends DrawableObject {
  static IMAGE_SETS = {
    health: [
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
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

  constructor(type, x, y, width, height, isReversed = false) {
    super();
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isReversed = isReversed;

    // Wähle die Bilder basierend auf dem Typ
    this.images = StatusBar.IMAGE_SETS[type];
    if (!this.images) {
      throw new Error(`StatusBar type "${type}" is not defined.`);
    }

    this.loadImages(this.images);
    this.setPercentage(isReversed ? 0 : 100); // Initialer Zustand
  }

  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(percentage, 100)); // Begrenze auf 0–100

    // Wähle das richtige Bild basierend auf dem Prozentwert
    let path = this.images[this.resolveImageIndex()];

    // Lade das Bild, wenn es noch nicht im Cache ist
    if (!this.imageCache[path]) {
      this.loadImage(path);
    }

    this.img = this.imageCache[path];

    if (!this.img) {
      console.error(
        `Image not found for percentage: ${percentage}, path: ${path}`
      );
    }
  }

  resolveImageIndex() {
    const thresholds = [0, 20, 40, 60, 80, 100];
    const isReversed = this.isReversed;

    // Finde den richtigen Index basierend auf dem aktuellen Prozentsatz
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (isReversed) {
        if (this.percentage >= thresholds[i]) return i;
      } else {
        if (this.percentage <= thresholds[i]) return i;
      }
    }
    return 0;
  }
}
