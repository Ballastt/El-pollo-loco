class DrawableObject {

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}