class DrawableObject {
    img;
    imageCache = {};
    
    x = 120;
    y = 250;
    
    height = 150;
    width = 100;


    //loadImage()
    loadImage(path) {
        let img = new Image();
        img.onload = () => {
        this.img = img; // erst setzen, wenn das Bild wirklich geladen ist
        };
        img.src = path;
    }

    /**
     * 
     * @param {Array} arr - ['img/image1.png', 'img/image2.png', ....]
     */
    loadImages(arr) {
        console.log('Loading images:', arr); // Debug-Pfade
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            img.onload = () => console.log(`Image loaded: ${path}`);
            img.onerror = () => console.error(`Failed to load image: ${path}`);
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        if (this.img instanceof HTMLImageElement && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
                // Optional: Platzhalter oder Skip-Zeile
                // console.log('Bild noch nicht geladen:', this.img);
        }
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