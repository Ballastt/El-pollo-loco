class Character extends MovableObject{
    IMAGES_WALKING = [
        '/img/2_character_pepe/2_walk/W-21.png',
        '/img/2_character_pepe/2_walk/W-22.png',
        '/img/2_character_pepe/2_walk/W-23.png',
        '/img/2_character_pepe/2_walk/W-24.png',
        '/img/2_character_pepe/2_walk/W-25.png',
        '/img/2_character_pepe/2_walk/W-26.png'
    ];

    
    constructor(){
        super().loadImage('/img/2_character_pepe/2_walk/W-21.png');

        this.x = 50;
        this.y = 180;
        this.width = 120;
        this.height = 250;

        this.loadImages(this.IMAGES_WALKING);

        this.animate();
        

        
    }

    animate() {

        setInterval(() => {
            let i = this.currentImage % this.IMAGES_WALKING.length;
            let path = this.IMAGES_WALKING[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 200);
        
    }
    
    jump() {

    }
}