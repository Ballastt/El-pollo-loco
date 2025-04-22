class MoveableObject extends DrawableObject{
    x = 120;
    y = 250;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.55;
    otherDirection = false; //standardmäßg mal falsch

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

              // Warten, bis das Bild vollständig geladen ist
              img.onload = () => {
                this.imageCache[path] = img; // Bild wird in Cache gespeichert, wenn es geladen ist
            };
        });
      
    }

    playAnimation(images) {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
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