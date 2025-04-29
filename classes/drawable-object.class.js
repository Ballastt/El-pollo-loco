class DrawableObject {

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawHitbox(ctx) {

        if (this instanceof Character || this instanceof Chicken || this instanceof Coin || this instanceof Endboss) {
            //Debug Hitbox
            ctx.beginPath();
            ctx.lineWidth = '4';
            ctx.strokeStyle = 'red';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
            
    }
}