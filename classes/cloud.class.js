class Cloud extends MoveableObject{


    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
    
        this.width = 600;
        this.height = 400;
        this.x = Math.random() * 6000; // Startposition zufällig
        this.y = 0 + Math.random() * 40; // Start-Höhe
        this.speed = 0.15 + Math.random() * 0.3; // Langsame Bewegung

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft(); //bewege Wolke nach links

            //Position zurücksetzen, wenn wolke aus Bildschirm verschwindet
            if(this.x + this.width < 0) {
                this.x = 6000;
                this.y = 0 + Math.random() * 40; // Neue zufällig Wolke
            }
        }, 1000 / 60); //60 frames per second        
    }
}