class Cloud extends MoveableObject{


    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
    
        this.width = 600;
        this.height = 400;
        this.animate();
        
        
    }

    animate() {
        this.moveLeft();

        if(this.x + this.width < 0) {
            this.x = 6000;
            this.y = 0 + Math.random() * 40;
        }
    }

    

}