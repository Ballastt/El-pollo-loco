/**
 * Controls all animation logic for the Endboss.
 */
class EndbossAnimationManager {
  /**
   * @param {Endboss} endboss - The Endboss instance to control.
   */
  constructor(endboss) {
    this.endboss = endboss;
  }

  /**
   * Handles the endboss animation based on its current state.
   */
  handleAnimations() {
    switch (this.endboss.currentState) {
      case this.endboss.STATES.WALKING:
        this.endboss.playAnimation(this.endboss.IMAGES_WALKING);
        break;
      case this.endboss.STATES.ALERT:
        this.endboss.playAnimation(this.endboss.IMAGES_ALERT);
        break;
      case this.endboss.STATES.ATTACK:
        this.endboss.playAnimation(this.endboss.IMAGES_ATTACK);
        break;
      case this.endboss.STATES.HURT:
        this.endboss.playAnimation(this.endboss.IMAGES_HURT);
        break;
      case this.endboss.STATES.DEAD:
        this.endboss.playAnimation(this.endboss.IMAGES_DEAD);
        break;
    }
  }

  /**
   * Updates the endboss state based on health, distance, and timers.
   */
  updateState() {
    if (this.endboss.isDead) return;
    if (this.endboss.health <= 0) return this.endboss.die();
    if (Date.now() < this.endboss.hurtUntil) return this.setHurtState();

    const distanceToPlayer = this.endboss.calculateDistance(this.endboss.character.x, this.endboss.character.y);

    if (this.shouldBeInIntroPhase(distanceToPlayer)) return this.handleIntroPhase();
    if (this.shouldAttack(distanceToPlayer)) return this.setAttackState();
    if (this.shouldAlert(distanceToPlayer)) return this.setAlertState();
    
    return this.setWalkingState();
  }

  /**
   * Returns true if the endboss should be in the intro phase.
   * @param {number} distanceToPlayer
   */
  shouldBeInIntroPhase(distanceToPlayer) {
    return this.endboss.introPhaseActive && distanceToPlayer < 800;
  }

  /**
   * Handles the intro phase logic.
   */
  handleIntroPhase() {
    this.setAlertState();

    if (!this.endboss.introStartedAt) {
      this.endboss.introStartedAt = Date.now();
      this.endboss.soundManager.play("introEndboss");
    }

    // After intro duration, deactivate intro phase
    if (Date.now() - this.endboss.introStartedAt > this.endboss.introDuration) {
      this.endboss.introPhaseActive = false;
    }
  }

  /**
   * Returns true if the endboss should attack.
   * @param {number} distanceToPlayer
   */
  shouldAttack(distanceToPlayer) {
    return distanceToPlayer < this.endboss.ATTACK_DISTANCE;
  }

  /**
   * Returns true if the endboss should be alert.
   * @param {number} distanceToPlayer
   */
  shouldAlert(distanceToPlayer) {
    return distanceToPlayer < 800;
  }

  /**
   * Sets the endboss to the hurt state and stops relevant sounds.
   */
  setHurtState() {
    this.endboss.currentState = this.endboss.STATES.HURT;
    this.endboss.soundManager.stop("endbossClucking");
    this.endboss.soundManager.stop("endbossAngry");
  }

  /**
   * Sets the endboss to the attack state and plays relevant sounds.
   */
  setAttackState() {
    if (this.endboss.currentState !== this.endboss.STATES.ATTACK) {
      this.endboss.soundManager.stop("endbossClucking");
      this.endboss.soundManager.play("endbossAngry");
    }
    this.endboss.currentState = this.endboss.STATES.ATTACK;
  }

  /**
   * Sets the endboss to the alert state and plays relevant sounds.
   */
  setAlertState() {
    if (this.endboss.currentState !== this.endboss.STATES.ALERT) {
      this.endboss.soundManager.play("endbossClucking");
      this.endboss.soundManager.stop("endbossAngry");
    }
    this.endboss.currentState = this.endboss.STATES.ALERT;

    if (!this.endboss.introSoundPlayed) {
      this.endboss.soundManager.play("introEndboss");
      this.endboss.introSoundPlayed = true;
    }
  }

  /**
   * Sets the endboss to the walking state and plays relevant sounds.
   */
  setWalkingState() {
    if (this.endboss.currentState !== this.endboss.STATES.WALKING) {
      this.endboss.soundManager.stop("endbossAngry");
      this.endboss.soundManager.play("endbossClucking");
    }
    this.endboss.currentState = this.endboss.STATES.WALKING;
  }

  /**
   * Handles the state and sounds when the endboss is hurt but not dead.
   */
  handleHurtState() {
    this.endboss.soundManager.stop("endbossClucking");
    this.endboss.currentState = this.endboss.STATES.HURT;
  }
}
