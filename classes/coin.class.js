class Coin extends MoveableObject{
    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'      
    ]

    constructor(x) {
        super().loadImage('img/8_coin/coin_1.png'); //coin
        this.x = x; //position of coin on x
        this.y = 30 + Math.random() * 300; // random y position
        this.width = 100; //coin width
        this.height = 100; //coin height
        this.speed = 0; //coins don't move

        this.hitbox = {
            offsetX: 30,
            offsetY: 30,
            width: 40,
            height: 40
        };

        this.loadImages(this.IMAGES_COIN);
    }
}