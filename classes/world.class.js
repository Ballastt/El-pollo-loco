class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0; //Kameradrehung
    level_end_x = 6000;
    collectedCoins = 0;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
     
    }

    setWorld() {
        this.character.world = this;
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.checkCoinCollection();
        
        //Adjusting camera so we won't go beyond level ending at level_end_x
        if(this.camera_x < this.level_end_x - this.canvas.width) {
            if (this.keyboard.RIGHT) {
                this.camera_x += 1;
            }
        }

        this.ctx.translate(this.camera_x, 0); //Kameradrehung inital
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.coins);
        this.addObjectToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectToMap(this.level.enemies);
        this.ctx.translate(-this.camera_x, 0); //nach dem malen der Objekte, müssen wir wieder zurücksetzen, damit es sich nicht weiter dreht
        
        //Draw() wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });

        
    }

    addObjectToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }


    //mo steht für moveableObject
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);

        mo.draw(this.ctx);
        mo.drawHitbox(this.ctx);

        if (mo.otherDirection) this.flipImageBack(mo);
    }

    flipImage(mo) {
        this.ctx.save(); //aktuelle Einstellungen speichern
        this.ctx.translate(mo.width, 0); //wir verändern, wie wir das Bild einfügen
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore(); //aktuelle Einstellungen wiederherstellen
    }

    checkCoinCollection() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)){
                this.level.coins.splice(index, 1); //removing coin from array
                this.collectedCoins++;
                console.log(`Coins collected: ${this.collectedCoins}`)
            }
        });
    }
}
