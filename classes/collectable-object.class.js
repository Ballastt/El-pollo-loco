class CollectableObject extends MoveableObject {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 0; // Keine Bewegung

        this.hitbox = {
            offsetX: 30,
            offsetY: 30,
            width: width - 60,
            height: height - 60
        };
    }

    loadCollectableImages(imagePaths) {
        this.loadImages(imagePaths);
    }
}
