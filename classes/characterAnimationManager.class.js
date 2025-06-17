/**
 * Manages character animations based on the current state.
 * Responsible for triggering the correct animation loop and managing animation transitions like idle, walking, jumping, etc.
 */
class CharacterAnimationManager {
  /**
   * Creates an instance of CharacterAnimationManager.
   * @param {Character} character - The character instance this manager controls.
   */
  constructor(character) {
    /** @type {Character} */
    this.character = character;

    /**
     * Flag to ensure the jump animation plays only once per jump.
     * @type {boolean}
     */
    this.jumpAnimationPlayed = false;
  }

  /**
   * Starts the interval that continuously updates the character animation based on the current state.
   */
  startAnimationLoop() {
    this.animationInterval = setInterval(() => {
      this.handleAnimations();
    }, 160);
  }

  /**
   * Determines and plays the correct animation based on the character's current state.
   */
  handleAnimations() {
    this.character.handleState?.();

    const animationMap = {
      [this.character.STATES.JUMPING]: this.character.IMAGES.JUMPING,
      [this.character.STATES.WALKING]: this.character.IMAGES.WALKING,
      [this.character.STATES.LONG_IDLE]: this.character.IMAGES.LONG_IDLE,
      [this.character.STATES.IDLE]: this.character.IMAGES.IDLE,
      [this.character.STATES.HURT]: this.character.IMAGES.HURT,
      [this.character.STATES.DEAD]: this.character.IMAGES.DEAD,
    };

    const state = this.character.currentState;
    const images = animationMap[state];
    this.character.playAnimation(images);
  }

  /**
   * Sets the character's state to idle and stops any snoring sound if active.
   */
  setIdle() {
    if (this.character.world?.gameManager?.isPaused) return;
    this.character.setState(this.character.STATES.IDLE);
    if (this.character.isSnoring) {
      this.character.world.soundManager.stop("snoringPepe");
      this.character.isSnoring = false;
    }
  }

  /**
   * Sets the character's state to long idle and starts snoring sound if not already playing.
   */
  setLongIdle() {
    if (this.character.world?.gameManager?.isPaused) return;
    this.character.setState(this.character.STATES.LONG_IDLE);
    if (!this.character.isSnoring) {
      this.character.world.soundManager.play("snoringPepe");
      this.character.isSnoring = true;
    }
  }

  /**
   * Determines whether to set the idle or long idle state based on time since last movement.
   * @param {number} now - The current timestamp.
   */
  setIdleOrLongIdleState(now) {
    const idleDuration = now - (this.character.lastMoveTime || now);
    if (idleDuration > 8000) {
      this.setLongIdle();
    } else {
      this.setIdle();
    }
  }

  /**
   * Triggers the jump animation if it hasn't already been played during this jump.
   */
  setJumpingState() {
    if (
      !this.jumpAnimationPlayed &&
      this.character.currentState !== this.character.STATES.JUMPING
    ) {
      this.character.currentImage = 0;
      this.character.setState(this.character.STATES.JUMPING);
      this.jumpAnimationPlayed = true;
    }
  }

  /**
   * Resets the jump animation flag so the next jump can trigger a new animation cycle.
   */
  resetJumpAnimationFlag() {
    this.jumpAnimationPlayed = false;
  }

  /**
   * Sets the character's state to walking, if not already in that state.
   */
  setWalkingState() {
    if (this.character.currentState !== this.character.STATES.WALKING) {
      this.character.setState(this.character.STATES.WALKING);
    }
  }
}
