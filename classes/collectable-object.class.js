class CollectableObject extends MoveableObject {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0; // Keine Bewegung

    // Standard-Hitbox (kann in Unterklassen überschrieben werden)
    this.hitbox = {
      offsetX: 0,
      offsetY: 0,
      width: width,
      height: height,
    };
  }

  loadCollectableImages(imagePaths) {
    this.loadImages(imagePaths);
  }
}
