class BackgroundObject extends MoveableObject {
  width = 720;
  height = 480;
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height; // 480 (Höhe vom Canvas) - 100 (Höhe des Objekts)
  }
}
