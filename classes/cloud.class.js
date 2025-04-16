class Cloud extends MovableObject{
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
    
        this.x = 100 + Math.random() * 500;
        this.y = 20;
        this.width = 500;
        this.height = 400;
        
    }
}