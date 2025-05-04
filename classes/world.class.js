class World {
    character;
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0; //Kameradrehung
    level_end_x = 6000;

    collectedCoins = 0;
    collectedBottles = 0;

    healthbar;
    throwbar;
    coinBar;

    throwableObjects = [];

    coinCollectSound;
    soundVolume = 0.2;


    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.character = new Character(this);

        this.coinCollectSound = new Audio('audio/get_coin.mp3');
        this.bottleCollectSound = new Audio('audio/get_bottle.mp3');
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
        this.run();
        this.checkCollisions();
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 200)
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.collectedBottles > 0) {
            let offsetX = this.character.otherDirection ? -10 : 60;
            let offsetY = 80;
    
            const bottle = new SalsaBottle(
                this.character.x + offsetX,
                this.character.y + offsetY,
                this.character.otherDirection
            );
    
            this.throwableObjects.push(bottle);
            this.character.collectedBottles--;
            this.updateThrowBar();
        }
    }
    

    checkCollisions() {
        // Kollision mit Feinden überprüfen
        this.character.checkCollisionsWithEnemy(this.level.enemies);
    
        //Aktualisiere die Gesundheitsleiste nach einer Kollision
        this.healthBar.setPercentage(this.character.health);
    }
    

    //gameloop 
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.checkCoinCollection();
        this.checkBottleCollection();
      
        //Adjusting camera so we won't go beyond level ending at level_end_x
        if(this.camera_x < this.level_end_x - this.canvas.width) {
            if (this.keyboard.RIGHT) {
                this.camera_x += 1;
            }
        }

        this.ctx.translate(this.camera_x, 0); //Kameradrehung inital

        //alle "beweglichen" Objekte zeichnen
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.coins);
        this.addObjectToMap(this.level.bottles);
        this.addObjectToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.throwableObjects);

    
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


    checkItemCollection(itemType, options) {
        const { items, characterProperty, sound, bar, maxItems, onCollect } = options;

        items.forEach((item, index) => {
            if (this.character.isColliding(item)) {
                console.log(`${itemType} gesammelt`);
                items.splice(index, 1); // Entferne das Item aus dem Level
            
                // Aktualisiere den Zähler des Charakters
                this.character[characterProperty] = (this.character[characterProperty] || 0) + 1;
            
                // Aktion beim Sammeln (z. B. Statusleiste aktualisieren, Punkte hinzufügen)
                if (onCollect) onCollect();

                // Audio abspielen
                if (sound) {
                    sound.currentTime = 0;
                    sound.play();
                }

                // Aktualisiere die Statusleiste (falls vorhanden)
                if (bar && maxItems) {
                    const percentage = (this.character[characterProperty] / maxItems) * 100;
                    bar.setPercentage(percentage);
                }
            }
        });
    }

    /**
     * Spezifische Funktionen für Coins
     */
    checkCoinCollection() {
        this.checkItemCollection('Coin', {
            items: this.level.coins,
            characterProperty: 'collectedCoins',
            sound: this.coinCollectSound,
            bar: this.coinBar,
            maxItems: this.level.totalCoins,
            onCollect: () => {
                console.log(`Coins collected: ${this.character.collectedCoins} / ${this.level.totalCoins}`);
            }
        });
    }

    /**
     * Spezifische Funktionen für Bottles
     */
    checkBottleCollection() {
        this.checkItemCollection('Bottle', {
            items: this.level.bottles,
            characterProperty: 'collectedBottles',
            sound: this.bottleCollectSound,
            bar: this.throwBar,
            maxItems: this.level.totalBottles,
            onCollect: () => {
                console.log(`Bottles collected: ${this.character.collectedBottles} / ${this.level.totalCoins}`);
            }
        });
    }

    /**
     * Lautstärke für Sounds anpassen
     */
    updateSoundVolume() {
        this.coinCollectSound.volume = this.soundVolume;
        this.bottleCollectSound.volume = this.soundVolume;
    }
    
    
}
