/**
 * Handles all movement logic for the Endboss.
 */
class EndbossMovementManager {
  /**
   * @param {Endboss} endboss - The Endboss instance to control.
   */
  constructor(endboss) {
    this.endboss = endboss;
  }

  /**
   * Moves the endboss depending on its current state.
   */
  moveDependingOnState() {
    if (this.endboss.isDead) return;

    switch (this.endboss.currentState) {
      case this.endboss.STATES.ATTACK:
        this.chargePlayer();
        break;
      case this.endboss.STATES.ALERT:
        this.moveTowardsCharacter(this.endboss.speedWalk);
        break;
      case this.endboss.STATES.WALKING:
        break;
    }
  }

  /**
   * Moves the endboss towards the character at the given speed.
   * @param {number} [speed=this.endboss.speedWalk] - The speed to move with.
   */
  moveTowardsCharacter(speed = this.endboss.speedWalk) {
    if (!this.endboss.character) return;

    const dx = this.endboss.character.x - this.endboss.x;
    const distance = Math.abs(dx);

    if (distance > this.endboss.MIN_DISTANCE_TO_PLAYER) {
      const direction = dx > 0 ? 1 : -1;
      this.endboss.x += direction * speed;
    }
  }

  /**
   * Charges the endboss towards the player with attack speed and jump logic.
   */
  chargePlayer() {
    const now = Date.now();
    if (now < this.endboss.chargeCooldown) return;

    const dx = this.endboss.character.x - this.endboss.x;
    const distance = Math.abs(dx);
    const direction = dx > 0 ? 1 : -1;

    if (distance > 30) this.endboss.x += direction * this.endboss.speedAttack;
    if (!this.endboss.isAboveGround() && Math.random() < 0.75)
      this.endboss.speedY = this.endboss.jumpForce;
    if (distance < 100) this.endboss.chargeCooldown = now + 2000;
  }

  /**
   * Checks if the character is far enough in the level and moves the endboss towards them.
   */
  checkCharacterPositionAndMove() {
    if (this.endboss.character.x >= 6000) {
      this.moveTowardsCharacter();
    }
  }
}
