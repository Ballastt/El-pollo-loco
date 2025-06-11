class CharacterCollisionManager {
  constructor(character) {
    this.character = character;
  }

  /**
   * Checks collision with the endboss and handles hit logic.
   * @param {Endboss} endboss
   */
  checkCollisionsWithEndboss(endboss) {
    if (this.isColliding(endboss) && this.canBeHit()) {
      if (endboss.currentState === endboss.STATES.ATTACK) {
        this.setState(this.STATES.HURT);
        this.hurtUntil = Date.now() + 500;

        this.hit(10); // nur im Angriffszustand!
      } else {
        console.error("Kollision mit Endboss, aber kein Angriff");
      }
    }
  }

  /**
   * Checks collision with enemies and handles hit/defeat logic.
   * @param {Array<Enemy>} enemies
   */
  checkCollisionsWithEnemy(enemies) {
    if (!this.world?.gameManager?.isGameRunning || this.isDead) return;
    if (!this.canBeHit()) return;

    for (let enemy of enemies) {
      if (enemy.isDead || !this.isColliding(enemy)) continue;
      if (this.isJumpingOnEnemy(enemy)) {
        this.defeatEnemy(enemy);
      } else {
        this.receiveHitFrom(enemy);
        break;
      }
    }
  }

  /**
   * Handles collision with a single enemy.
   * @param {Enemy} enemy
   */
  handleEnemyCollision(enemy) {
    if (enemy.isDead || !this.isColliding(enemy)) return;

    if (this.isJumpingOnEnemy(enemy)) {
      this.defeatEnemy(enemy);
    } else {
      this.receiveHitFrom(enemy);
    }
  }
}
