class Endboss extends MoveableObject {
  world;
  character;
  height = 400;
  width = 300;
  isDead = false;
  hurtUntil = 0;
  currentState = "walking";
  speed = 3;
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
    super().loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
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
  }

  animate() {
    this.startAnimationLoop();
  }

  startAnimationLoop() {
    setInterval(() => {
      this.handleAnimations();
      this.updateState();
      this.checkCharacterPositionAndMove();
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

  // Zustand aktualisieren basierend auf der Distanz zum Charakter
  updateState() {
    if (this.character) {
      // Sicherstellen, dass der Charakter existiert
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

          //Hier IntroSound abspielen
          if (!this.introSoundPlayed) {
            this.soundManager.play("introEndboss");
            this.soundManager.setVolume("introEndboss, 1.0");
            this.introSoundPlayed = true;
             console.log("Endboss-Intro-Sound abgespielt");
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

  moveTowardsCharacter() {
    if (this.character && this.currentState !== this.STATES.DEAD) {
      const characterX = this.character.x;
      if (this.x > characterX) {
        this.x -= this.speed;
      } else if (this.x < characterX) {
        this.x += this.speed;
      }
    }
  }

  hurt(damage = 10) {
    this.health -= damage;
    if (this.health < 0) {
      this.die();
    } else {
      console.log("Endboss nimmt Schaden!");
      this.currentState = this.STATES.HURT;
    }
  }
}
