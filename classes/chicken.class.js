class Chicken extends MoveableObject{
    constructor(imagePath, imageArray, imageDeadArray, width, height, speedRange){
        super();

        this.x = 200 + Math.random() * 5700;
        this.y = 370;
        this.speed = speedRange[0] + Math.random() * speedRange[1];
        this.height = height;
        this.width = width;
        this.IMAGES_WALKING = imageArray;
        this.IMAGES_DEAD = imageDeadArray;

        this.imageCache = {};
        this.loadImage(imagePath);

        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
            this.otherDirection = false;
        }, 1000 / 60)
       
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
        
    }
}