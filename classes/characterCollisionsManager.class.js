/**
 * Manages all collision-related logic for the character.
 * Handles interactions with enemies and the endboss, including damage and defeating enemies by jumping on them.
 */
class CharacterCollisionManager {
  /**
   * Creates an instance of CharacterCollisionManager.
   * @param {Character} character - The character this collision manager is responsible for.
   */
  constructor(character) {
    /** @type {Character} */
    this.character = character;

    /** @type {World} */
    this.world = character.world;
  }

  /**
   * Checks for collisions between the character and the endboss.
   * If a collision occurs while the endboss is attacking, the character takes damage.
   * @param {Endboss} endboss - The endboss instance to check collisions against.
   */
  checkCollisionsWithEndboss(endboss) {
    if (this.character.isColliding(endboss) && this.canBeHit()) {
      if (endboss.currentState === endboss.STATES.ATTACK) {
        this.character.setState(this.character.STATES.HURT);
        this.character.hurtUntil = Date.now() + 500;
        this.character.hit(10);
      } else {
        console.error(
          "Collision with endboss occurred, but endboss was not attacking."
        );
      }
    }
  }

  /**
   * Checks for collisions between the character and all active enemies.
   * If the character jumps on an enemy, the enemy is defeated.
   * Otherwise, the character takes damage.
   * @param {Array<Enemy>} enemies - The list of enemies to check against.
   */
  checkCollisionsWithEnemy(enemies) {
    if (!this.world?.gameManager?.isGameRunning || this.character.isDead)
      return;
    if (!this.canBeHit()) return;

    let closestEnemy = null;
    let minDistance = Infinity;

    for (const enemy of enemies) {
      if (enemy.isDead || !this.character.isColliding(enemy)) continue;

      const dx = Math.abs(
        this.character.x +
          this.character.width / 2 -
          (enemy.x + enemy.width / 2)
      );

      if (dx < minDistance) {
        minDistance = dx;
        closestEnemy = enemy;
      }
    }

    if (closestEnemy) {
      if (this.character.isJumpingOnEnemy(closestEnemy)) {
        this.character.defeatEnemy(closestEnemy);
      } else {
        this.receiveHitFrom(closestEnemy);
      }
    }
  }

  /**
   * Handles collision with a single enemy.
   * If the character jumps on the enemy, it is defeated.
   * Otherwise, the character takes damage.
   * @param {Enemy} enemy - The enemy to check and handle collision with.
   */
  handleEnemyCollision(enemy) {
    if (enemy.isDead || !this.character.isColliding(enemy)) return;

    if (this.character.isJumpingOnEnemy(enemy)) {
      this.character.defeatEnemy(enemy);
    } else {
      this.receiveHitFrom(enemy);
    }
  }

  /**
   * Returns true if the character is currently allowed to receive damage.
   * @returns {boolean}
   */
  canBeHit() {
    return this.character.canBeHit?.() ?? true;
  }

  /**
   * Handles logic when the character receives a hit from an enemy.
   * @param {Enemy} enemy - The enemy that hit the character.
   */
  receiveHitFrom(enemy) {
    if (this.world?.gameManager?.isPaused || this.character.isDead) return;
    if (this.character.isJumpingOnEnemy(enemy)) {
      this.character.defeatEnemy(enemy);
      return;
    }
    if (!this.canBeHit()) return;

    this.character.setState(this.character.STATES.HURT);
    this.character.hurtUntil = Date.now() + 500;
    this.character.hit(10);
  }
}
