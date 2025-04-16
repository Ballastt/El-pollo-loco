class Chicken extends MovableObject{
    constructor(){
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        this.x = 200 + Math.random() * 500;
        this.y = 370;
        this.speed = 2;
        this.height = 50;
        this.width = 50;
    }
}