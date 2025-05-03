class ThrowableObject extends MoveableObject {
    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    IMAGES_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(x, y) {
       super();
       this.loadImages(this.IMAGES_ROTATION);
       this.loadImages(this.IMAGES_SPLASH);
       this.loadImages(this.IMAGES_GROUND);
  
       this.x = x;
       this.y = y;
       this.width = 80; // Beispielgröße
       this.height = 80; // Beispielgröße

       this.isFlying = false;
   }

   throwBottle() {
        this.isFlying = true;
        this.speedY = 20; //Beispielgeschwindigkeit
        this.applyGravity();

        //Animation der Rotation starten
        this.animateRotation();
   }

   animateRotation() {
        let index = 0;
        const interval = setInterval(() => {
            if (!this.isFlying) {
                clearInterval(interval); //stoppt Animation, wenn flasche nicht mehr fliegt
                return;
            }
            this.img = this.imageCache[this.IMAGES_ROTATION[index]];
            index = (index + 1) % this.IMAGES_ROTATION.length;
        }, 100);
   }

   splash() {
        this.isFlying = false;

        let index = 0;
        const interval = setInterval(() => {
            if (index >= this.IMAGES_SPLASH.length) {
                clearInterval(interval);
                this.setGroundImage();
                return;
            }
            this.img = this.imageCache[this.IMAGES_SPLASH[index]];
            index++;
        }, 100);
   }

   setGroundImage() {
        const index = Math.floor(Math.random() * this.IMAGES_GROUND.length); //Zufallsindex
        this.img = this.imageCache[this.IMAGES_GROUND[index]];
   }
}
