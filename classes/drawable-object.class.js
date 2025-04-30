class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;

    x = 120;
    y = 250;
    
    height = 150;
    width = 100;


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

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    }

    drawHitbox(ctx) {

        if (this instanceof Character || this instanceof Chicken || this instanceof Coin || this instanceof Endboss) {
            //Debug Hitbox
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';
           
            if (this.hitbox) {
                ctx.rect(
                    this.x + this.hitbox.offsetX,
                    this.y + this.hitbox.offsetY,
                    this.hitbox.width,
                    this.hitbox.height
                );
            } else {
                // fallback – ganze Bildgröße, falls keine hitbox definiert
                ctx.rect(this.x, this.y, this.width, this.height);
            }

            ctx.stroke();
        }
            
    }
}