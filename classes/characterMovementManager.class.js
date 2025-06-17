/**
 * Handles player movement, input, and camera tracking.
 * Controls how the character moves in response to keyboard input and updates movement-related state.
 */
class CharacterMovementManager {
  /**
   * Creates an instance of CharacterMovementManager.
   * @param {Character} character - The character this manager controls.
   */
  constructor(character) {
    /** @type {Character} */
    this.character = character;
  }

  /**
   * Handles movement input and updates the character's movement state.
   * Delegates to input and state handling methods.
   */
  handleMovement() {
    this.handleInput?.();
    this.handleState?.();
  }

  /**
   * Handles all keyboard input for movement.
   * Splits movement into horizontal and jump inputs.
   */
  handleInput() {
    if (this.character.isDead || Date.now() < this.character.hurtUntil) return;
    if (!this.character.lastMoveTime) this.character.lastMoveTime = Date.now();

    this.processHorizontalInput();
    this.processJumpInput();
  }

  /**
   * Processes horizontal movement input.
   * @returns moved to true if keyboard input is detected.
   */
  hasMovedHorizontally() {
    const world = this.character.world;
    let moved = false;

    if (world.keyboard.RIGHT && this.character.x < world.level.level_end_x) {
      this.handleRightInput();
      moved = true;
    }

    if (world.keyboard.LEFT && this.character.x > 0) {
      this.handleLeftInput();
      moved = true;
    }

    return moved;
  }

  /**
   * Processes left/right movement input.
   * Sets `isMoving` to true if horizontal input is detected.
   */
  processHorizontalInput() {
    const moved = this.hasMovedHorizontally();
    this.character.isMoving = moved;

    if (moved) {
      this.character.lastMoveTime = Date.now();
    }
  }

  /**
   * Processes jump input.
   * Triggers jump only if character is grounded.
   */
  processJumpInput() {
    const world = this.character.world;

    if (world.keyboard.UP && !this.character.isAboveGround()) {
      this.handleJumpInput();
    }
  }

  /**
   * Handles right movement input logic.
   */
  handleRightInput() {
    this.character.moveRight();
    this.character.stopSnoring?.();
    this.character.isMoving = true;
  }

  /**
   * Handles left movement input logic.
   */
  handleLeftInput() {
    this.character.moveLeft();
    this.character.stopSnoring?.();
    this.character.isMoving = true;
  }

  /**
   * Handles jump input logic and sound effects.
   */
  handleJumpInput() {
    const world = this.character.world;

    this.character.jump();

    if (world.soundManager) world.soundManager.play("jumpSound");
  }

  /**
   * Updates the camera position to follow the character.
   */
  updateCamera() {
    if (this.character.world) {
      this.character.world.camera_x = -this.character.x + 100;
    }
  }
}
