class World {
    character;
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0; //Kameradrehung
    level_end_x = 6000;
    collectedCoins = 0;

    healthbar;
    throwbar;
    coinBar;

    coinCollectSound;
    soundVolume = 0.2;

    bottles = [];
    availableBottles = [];

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.character = new Character(this);

        for(let i = 0; i < 30; i++) {
            this.availableBottles.push(new SalsaBottle(0, 0));
        }

        this.coinCollectSound = new Audio('audio/get_coin.mp3');
        this.updateSoundVolume();

         // Bildpfade für die drei Statusbars definieren
         const healthImages = [
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
        ];

        const throwImages = [
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
        ];

        const coinImages = [
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
        ];
        
        // Statusbars mit den jeweiligen Bildern initialisieren
        this.healthBar = new StatusBar(healthImages, 0, 0, 250, 60);
        this.throwBar = new StatusBar(throwImages, 0, 50, 250, 60);
        this.coinBar = new StatusBar(coinImages, 0, 100, 250, 60, true);

        this.coinBar.setPercentage(0);
       
        this.draw();
        this.checkCollisions();
    }

    throwBottle() {
        if (this.availableBottles.length > 0) {
            // Flasche aus dem Array "popen"
            const bottle = this.availableBottles.pop();
            bottle.x = this.character.x + 50; // Position der Flasche vor dem Charakter
            bottle.y = this.character.y;
            bottle.throwBottle(); // Flasche werfen
            this.bottles.push(bottle); // Flasche in das "geworfene"-Array verschieben
        } else {
            console.log('Keine Flaschen mehr verfügbar!');
        }
    }
    
    checkCollisions() {
        setInterval(() => {
            this.character.checkCollisionsWithEnemy(this.level.enemies);
        }, 100); // reicht alle 100ms für Kollisionen
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

        // Geworfene Flaschen zeichnen
        this.bottles.forEach(bottle => {
            this.addToMap(bottle);
        });

        //alle "beweglichen" Objekte zeichnen
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.coins);
        this.addObjectToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectToMap(this.level.enemies);

        //Kamera wieder zurücksetzen
        this.ctx.translate(-this.camera_x, 0); //nach dem malen der Objekte, müssen wir wieder zurücksetzen, damit es sich nicht weiter dreht
        
        //Zeichne UI-elemente die nicht von der Kamera beeinflusst sind
        // Zeichne die Statusbars
        this.addToMap(this.healthBar);
        this.addToMap(this.throwBar);
        this.addToMap(this.coinBar);


         // Nächster Frame
        requestAnimationFrame(() => this.draw());
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

                //Audio abspielen
                this.coinCollectSound.currentTime = 0;
                this.coinCollectSound.play();

                console.log(`Coins collected: ${this.collectedCoins} / ${this.level.totalCoins}`);

                 // Aktualisiere die CoinBar
                if (this.coinBar) {
                    let percentage = (this.collectedCoins / this.level.totalCoins) * 100;
                    this.coinBar.setPercentage(percentage);
                }
            }
        });
    }

    updateSoundVolume() {
        // Lautstärke für alle Sounds anpassen
        this.coinCollectSound.volume = this.soundVolume;
    }
}
