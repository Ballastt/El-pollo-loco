class Cloud extends MoveableObject{


    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
    
        this.x = 100 + Math.random() * 500;
        this.y = 20;
        this.width = 600;
        this.height = 400;
        this.speed = 1.2;
        this.animate();
        
        
    }

    animate() {
        this.moveLeft();
    }

    

}