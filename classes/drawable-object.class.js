class DrawableObject {
  img;
  imageCache = {};

  x = 0; 
  y = 0; 
  width = 50; 
  height = 50; 

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
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    if (this.img instanceof HTMLImageElement && this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } 
  }

  drawHitbox(ctx) {
    if (
      this instanceof Character ||
      this instanceof Endboss
    ) {
      //Debug Hitbox
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "red";

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
