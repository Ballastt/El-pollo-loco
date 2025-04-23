class Chicken extends MoveableObject{
    constructor(imagePath, imageArray, width, height, speedRange){
        super().loadImage(imagePath);

        this.x = 200 + Math.random() * 5000;
        this.y = 370;
        this.speed = speedRange[0] + Math.random() * speedRange[1];
        this.height = height;
        this.width = width;
        this.IMAGES_WALKING = imageArray;

        this.loadImages(this.IMAGES_WALKING);
        this.animate();

        
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
        
    }
}