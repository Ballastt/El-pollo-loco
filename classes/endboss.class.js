class Endboss extends MoveableObject {
  world;
  character;
  height = 400;
  width = 300;
  isDead = false;
  hurtUntil = 0;
  currentState = "walking";
  speedWalk = 3;
  speedAttack = 8;
  jumpForce = 30;
  chargeCooldown = 0;
  introSoundPlayed = false;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  STATES = {
    WALKING: "walking",
    ALERT: "alert",
    ATTACK: "attack",
    HURT: "hurt",
    DEAD: "dead",
  };

  constructor(character) {
    super();
    this.loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 6300;
    this.y = 50;
    this.character = character;
    this.soundManager = soundManager;
    this.animate();

    console.log("Endboss initialisiert mit Leben:", this.health);

    this.hitbox = {
      offsetX: 10, // je nach Bild zuschneiden
      offsetY: 100,
      width: 300,
      height: 300,
    };
  }

  animate() {
    this.startAnimationLoop();
  }

  startAnimationLoop() {
    this.animationInterval = setInterval(() => {
      this.handleAnimations();
      this.updateState();
      this.moveDependingOnState();
    }, 100);
  }

  handleAnimations() {
    switch (this.currentState) {
      case this.STATES.WALKING:
        this.playAnimation(this.IMAGES_WALKING);
        break;
      case this.STATES.ALERT:
        this.playAnimation(this.IMAGES_ALERT);
        break;
      case this.STATES.ATTACK:
        this.playAnimation(this.IMAGES_ATTACK);
        break;
      case this.STATES.HURT:
        this.playAnimation(this.IMAGES_HURT);
        break;
      case this.STATES.DEAD:
        this.playAnimation(this.IMAGES_DEAD);
        break;
    }
  }

  updateState() {
    if (this.character) {
      const distanceToPlayer = this.calculateDistance(
        this.character.x,
        this.character.y
      );

      if (this.isDead) {
        this.currentState = this.STATES.DEAD;
      } else if (distanceToPlayer < 200) {
        this.currentState = this.STATES.ATTACK;
      } else if (distanceToPlayer < 400) {
        this.currentState = this.STATES.ALERT;
        if (!this.introSoundPlayed) {
          this.soundManager.play("introEndboss");
          this.soundManager.setVolume("introEndboss", 1.0);
          this.introSoundPlayed = true;
          console.log("🎵 Intro abgespielt");
        }
      } else {
        this.currentState = this.STATES.WALKING;
      }
    }
  }

  // Berechnung der Distanz zwischen Endboss und Charakter
  calculateDistance(characterX, characterY) {
    const dx = this.x - characterX;
    const dy = this.y - characterY;
    return Math.sqrt(dx * dx + dy * dy); // Pythagoras: √(dx² + dy²)
  }

  //Endboss bewegt sich nur, wenn Charakter am Ende des Spiels
  checkCharacterPositionAndMove() {
    if (this.character.x >= 6000) {
      this.moveTowardsCharacter();
    }
  }

  moveDependingOnState() {
    if (this.isDead) return;

    switch (this.currentState) {
      case this.STATES.ATTACK:
        this.chargePlayer();
        break;

      case this.STATES.ALERT:
        this.moveTowardsCharacter(this.speedWalk);
        break;

      case this.STATES.WALKING:
        break;
    }
  }

  moveTowardsCharacter(speed) {
    if (!this.character) return;
    const characterX = this.character.x;
    if (this.x > characterX) this.x -= speed;
    else if (this.x < characterX) this.x += speed;
  }

  hurt(damage = 10) {
    const now = Date.now();
    if (now < this.hurtUntil || this.isDead) return;

    this.health -= damage;
    this.hurtUntil = now + 1000;

    console.log(
      `Endboss nimmt ${damage} Schaden, verbleibend: ${this.health} HP`
    );

    if (this.health <= 0) {
      this.die();
    } else {
      this.currentState = this.STATES.HURT;
    }
  }

  die() {
    this.isDead = true;
    this.currentState = this.STATES.DEAD;
    this.playAnimation(this.IMAGES_DEAD);
    console.log("⚰️ Endboss ist tot.");

    if (this.world && this.world.gameManager) this.world.gameManager.gameWon();
  }

  stop() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    console.log("⛔ Endboss gestoppt.");
  }

  chargePlayer() {
    const now = Date.now();
    if (now < this.chargeCooldown) return;
    console.log("⏱️ Charge cooldown: ", now < this.chargeCooldown);

    const dx = this.character.x - this.x;
    const distance = Math.abs(dx);
    const direction = dx > 0 ? 1 : -1;

    // Sprinten
    if (distance > 30) {
      this.x += direction * this.speedAttack;
    }

    // 25 % Chance zu springen, wenn auf Boden
    // Temporär ersetzen zum Testen
    if (Math.random() < 0.25) {
      this.speedY = this.jumpForce;
      console.log("💥 Endboss springt!");
    }

    // Cooldown setzen
    if (distance < 100) {
      this.chargeCooldown = now + 2000; // 2 Sekunden warten
    }
  }
}
