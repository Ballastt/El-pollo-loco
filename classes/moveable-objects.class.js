class MoveableObject extends DrawableObject{
    currentImage = 0;
    speed = 0.55;
    otherDirection = false; //standardmäßg mal falsch
    speedY = 0;
    acceleration = 2.5;
    health = 100;
    lastHit = 0;


    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 20);
    }

    isAboveGround() {
        return this.y < 170;
    }

   

    playAnimation(images) {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }


    //Schablone (wie ein JSON)
    moveRight(){
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = true;
    }
              
    //character isColliding(Chicken)
    isColliding(mo) {
        return this.x + this.width > mo.x && 
               this.y + this.height > mo.y &&
               this.x < mo.x &&
               this.y < mo.y + mo.height
    }
    
    jump() {
        this.speedY = 25;
    }

    hit() {
        let now = Date.now();
        if (now - this.lastHit > 1000) {   // 1 Sekunde Schutz
            this.health -= 5;
            console.log(this.health);
            this.lastHit = now;
        }
    }
    
}