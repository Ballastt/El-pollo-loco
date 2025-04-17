class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.55;

    //loadImage()
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    /**
     * 
     * @param {Array} arr - ['img/image1.png', 'img/image2.png', ....]
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image(); //1. neues Image-Objekt wird erzeugt
            img.src = path;     // 1. Bildpfad wird gesetzt => Browser lädt das Bild
            this.imageCache[path] = img; //3. Bild wird in Cache gespeichert
        });
      
    }
      
    

    //Schablone (wie ein JSON)
    moveRight(){
        console.log("Moving right");
    }

    
    moveLeft() {
        setInterval( () => {
            this.x -= this.speed; //kann natürlich verändert werden;
        }, 1000 / 60);

        console.log("moving left");
    }
        
        
    
}