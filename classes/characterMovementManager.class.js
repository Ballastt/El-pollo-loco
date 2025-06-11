class CharacterMovementManager {
  constructor(character) {
    this.character = character;
  }

  /**
   * Handles movement input and updates state.
   */
  handleMovement() {
    this.handleInput();
    this.handleState();
  }

  /**
   * Handles keyboard input for movement.
   */
  handleInput() {
    if (this.isDead || Date.now() < this.hurtUntil) return;
    this.isMoving = false;
    if (!this.lastMoveTime) this.lastMoveTime = Date.now();

    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x)
      this.handleRightInput();
    if (this.world.keyboard.LEFT && this.x > 0) this.handleLeftInput();
    if (this.world.keyboard.UP && !this.isAboveGround()) this.handleJumpInput();
  }
  /**
   * Handles right movement input.
   */
  handleRightInput() {
    this.moveRight();
    this.stopSnoring();
    this.isMoving = true;
  }

  /**
   * Handles left movement input.
   */
  handleLeftInput() {
    this.moveLeft();
    this.stopSnoring();
    this.isMoving = true;
  }

  /**
   * Handles jump input.
   */
  handleJumpInput() {
    this.jump();
    if (this.world.soundManager) {
      this.world.soundManager.play("jumpSound");
    }
  }

  /**
   * Updates the camera position based on character location.
   */
  updateCamera() {
    if (this.world) {
      this.world.camera_x = -this.x + 100;
    }
  }
}
