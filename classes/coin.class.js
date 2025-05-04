class Coin extends CollectableObject{
    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x, y) {
        super(x, y, 100, 100); // Übergibt Größe an CollectableObject
        this.loadImage('img/8_coin/coin_1.png');
        this.loadCollectableImages(this.IMAGES_COIN);

        this.hitbox = {
            offsetX: 30, //Verschiebung der Hitbox nach rechts
            offsetY: 30, //Verschiebung der Hitbox nach unten
            width: 40, 
            height: 38
        }
    }

    
}