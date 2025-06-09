class Endboss extends MoveableObject {
  world;
  character;
  height = 400;
  width = 300;
  isDead = false;
  hurtUntil = 0;
  currentState = "walking";
  speedWalk = 15;
  speedAttack = 45;
  jumpForce = 30;
  chargeCooldown = 0;
  introSoundPlayed = false;
  isPaused = false;
  ATTACK_DISTANCE = 370;

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

  constructor(character, world) {
    super();
    this.character = character;
    this.world = world;
    this.gameManager = world?.gameManager;
    this.soundManager = soundManager;

    this.initImages();
    this.initPosition();
    this.initHitbox();

    this.applyGravity();
    this.animate();

    console.log(`Endboss initialisiert mit Leben: ${this.health}`);
  }

  animate() {
    this.startAnimationLoop();
  }

  startAnimationLoop() {
    this.animationInterval = setInterval(() => {
      if (this.isPaused) return;
      this.handleAnimations();
      this.updateState();
      this.moveDependingOnState();
    }, 100);
  }

  initPosition() {
    this.x = 6300;
    this.y = 50;
    this.groundY = 50;
  }

  initImages() {
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  initHitbox() {
    this.hitbox = {
      offsetX: 10,
      offsetY: 100,
      width: 300,
      height: 300,
    };
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

  pause() {
    this.isPaused = true;
    console.log("Endboss pausiert.");
  }

  resume() {
    this.isPaused = false;
    console.log("Endboss läuft weiter.");
  }

  updateState() {
    if (this.isDead) return; // 🧹 Wenn tot, dann nichts mehr tun
    if (this.health <= 0) return this.die(); // stirbt nur 1×
    if (Date.now() < this.hurtUntil) return this.setHurtState();

    const distanceToPlayer = this.calculateDistance(
      this.character.x,
      this.character.y
    );

    if (distanceToPlayer < this.ATTACK_DISTANCE) return this.setAttackState();
    if (distanceToPlayer < 400) return this.setAlertState();
    return this.setWalkingState();
  }

  setHurtState() {
    this.currentState = this.STATES.HURT;
    console.log("State: HURT - stoppe alle Sounds");
    this.soundManager.stop("endbossClucking");
    this.soundManager.stop("endbossAngry");
  }

  setAttackState() {
    if (this.currentState !== this.STATES.ATTACK) {
      console.log(
        "State: ATTACK - spiele 'endbossAngry', stoppe 'endbossClucking'"
      );
      this.soundManager.stop("endbossClucking");
      this.soundManager.play("endbossAngry");
    }
    this.currentState = this.STATES.ATTACK;
  }

  setAlertState() {
    if (this.currentState !== this.STATES.ALERT) {
      console.log(
        "State: ALERT - spiele 'endbossClucking', stoppe 'endbossAngry'"
      );
      this.soundManager.play("endbossClucking");
      this.soundManager.stop("endbossAngry");
    }
    this.currentState = this.STATES.ALERT;

    console.log(this.introSoundPlayed);
    if (!this.introSoundPlayed) {
      this.soundManager.play("introEndboss");
      this.introSoundPlayed = true;
      console.log("🎵 Intro abgespielt");
    }
  }

  setWalkingState() {
    if (this.currentState !== this.STATES.WALKING) {
      console.log(
        "State: WALKING - spiele 'endbossClucking', stoppe 'endbossAngry'"
      );
      this.soundManager.stop("endbossAngry");
      this.soundManager.play("endbossClucking");
    }
    this.currentState = this.STATES.WALKING;
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

  ensureClucking() {
    if (
      !this.isDead &&
      Date.now() >= this.hurtUntil &&
      !this.soundManager.play("endbossClucking")
    ) {
      this.soundManager.play("endbossClucking");
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

  moveTowardsCharacter(speed = this.speedWalk) {
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
    this.soundManager.play("endbossHurt");

    if (this.health <= 0) {
      this.die();
    } else {
      this.soundManager.stop("endbossClucking");
      this.currentState = this.STATES.HURT;
    }
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.currentState = this.STATES.DEAD;
    this.playAnimation(this.IMAGES_DEAD);
    console.log("⚰️ Endboss ist tot.");

    // Sounds nur EINMAL stoppen
    this.soundManager.play("endbossDying");
    this.soundManager.stop("endbossClucking");
    this.soundManager.stop("endbossAngry");

    console.log("📦 this.world =", this.world);
    console.log("🎮 this.world.gameManager =", this.world?.gameManager);

    setTimeout(() => {
      console.log("Death-Animation abgeschlossen");
      this.soundManager.play("gameWon");
      this.world.gameManager.gameWon?.();
    }, 2000); // 2 Sekunden für die Animation
  }

  stop() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  chargePlayer() {
    const now = Date.now();
    if (now < this.chargeCooldown) return;

    const dx = this.character.x - this.x;
    const distance = Math.abs(dx);
    const direction = dx > 0 ? 1 : -1;

    if (distance > 30) this.x += direction * this.speedAttack;
    if (!this.isAboveGround() && Math.random() < 0.75) this.speedY = this.jumpForce;
    if (distance < 100) this.chargeCooldown = now + 2000;
  }
}
