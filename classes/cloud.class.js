class Cloud extends MovableObject{
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
    
        this.x = 100 + Math.random() * 500;
        this.y = 20;
        this.width = 600;
        this.height = 400;
        this.animate();
        
    }

    animate() {
        setInterval( () => {
            this.x -= 1; //kann natürlich verändert werden;
        }, 1000 / 60);
        
    }
}