class CharacterAnimationManager {
  constructor(character) {
    this.character = character;
  }

  /**
   * Starts the animation interval.
   */
  startAnimationLoop() {
    this.animationInterval = setInterval(() => {
      this.handleAnimations();
    }, 50);
  }
  /**
   * Handles character animation based on state.
   */
  handleAnimations() {
    const animationMap = {
      [this.STATES.JUMPING]: this.IMAGES.JUMPING,
      [this.STATES.WALKING]: this.IMAGES.WALKING,
      [this.STATES.LONG_IDLE]: this.IMAGES.LONG_IDLE,
      [this.STATES.IDLE]: this.IMAGES.IDLE,
      [this.STATES.HURT]: this.IMAGES.HURT,
      [this.STATES.DEAD]: this.IMAGES.DEAD,
    };

    this.playAnimation(animationMap[this.currentState]);
  }
  /**
   * Sets the character to idle state and stops snoring if needed.
   */
  setIdle() {
    if (this.world?.gameManager?.isPaused) return;
    this.setState(this.STATES.IDLE);
    if (this.isSnoring) {
      this.world.soundManager.stop("snoringPepe");
      this.isSnoring = false;
    }
  }

  /**
   * Sets the character to long idle state and starts snoring if needed.
   */
  setLongIdle() {
    if (this.world?.gameManager?.isPaused) return;
    this.setState(this.STATES.LONG_IDLE);
    if (!this.isSnoring) {
      this.world.soundManager.play("snoringPepe");
      this.isSnoring = true;
    }
  }
  setJumpingState(now) {
    /* ... */
  }
  setWalkingState(now) {
    /* ... */
  }
  /**
   * Sets the character to idle or long idle state based on inactivity.
   * @param {number} now
   */
  setIdleOrLongIdleState(now) {
    const idleDuration = now - (this.lastMoveTime || now);
    if (idleDuration > 8000) {
      this.setLongIdle();
    } else {
      this.setIdle();
    }
  }
}
