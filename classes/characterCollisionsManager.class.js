/**
 * Manages all collision-related logic for the character.
 * Handles interactions with enemies and the endboss, including damage and defeating enemies by jumping on them.
 *
 * @class
 * @property {Character} character - The character this collision manager is responsible for.
 * @property {World} world - The game world in which the character exists.
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
      }
    }
  }

  /**
   * Checks for collisions between the character and all active enemies.
   * If a collision is detected, determines the proper response (jump or damage).
   * @param {Array<Enemy>} enemies - The list of enemies to check against.
   */
  checkCollisionsWithEnemy(enemies) {
    if (!this.shouldCheckEnemyCollisions()) return;

    const closestEnemy = this.findClosestCollidingEnemy(enemies);
    if (!closestEnemy) return;

    this.resolveEnemyCollision(closestEnemy);
  }

  /**
   * Determines whether enemy collision checks should proceed.
   * @returns {boolean} True if checks should be performed.
   */
  shouldCheckEnemyCollisions() {
    return (
      this.world?.gameManager?.isGameRunning &&
      !this.character.isDead &&
      this.canBeHit()
    );
  }

  /**
   * Finds the closest enemy that is currently colliding with the character.
   * @param {Array<Enemy>} enemies - The list of enemies to evaluate.
   * @returns {Enemy|null} The closest colliding enemy or null if none.
   */
  findClosestCollidingEnemy(enemies) {
    return enemies.reduce((closest, enemy) => {
      if (enemy.isDead || !this.character.isColliding(enemy)) return closest;

      const dx = this.getDistanceTo(enemy);
      return !closest || dx < this.getDistanceTo(closest) ? enemy : closest;
    }, null);
  }

  /**
   * Calculates horizontal distance between the character and an enemy.
   * @param {Enemy} enemy
   * @returns {number}
   */
  getDistanceTo(enemy) {
    const charCenterX = this.character.x + this.character.width / 2;
    const enemyCenterX = enemy.x + enemy.width / 2;
    return Math.abs(charCenterX - enemyCenterX);
  }

  /**
   * Resolves a collision between the character and an enemy.
   * Determines if the enemy should be defeated or the character damaged.
   * @param {Enemy} enemy - The colliding enemy.
   */
  resolveEnemyCollision(enemy) {
    if (!enemy) return;

    if (this.character.isJumpingOnEnemy(enemy)) {
      this.character.defeatEnemy(enemy);
    } else {
      this.receiveHitFrom(enemy);
    }
  }

  /**
   * Checks if the character can currently receive damage.
   * @returns {boolean} True if the character can be hit.
   */
  canBeHit() {
    return this.character.canBeHit?.() ?? true;
  }

  /**
   * Applies damage to the character when hit by an enemy.
   * Skips damage if the character is jumping on the enemy or cannot be hit.
   * @param {Enemy} enemy - The enemy causing the damage.
   */
  receiveHitFrom(enemy) {
    if (this.world?.gameManager?.isPaused || this.character.isDead) return;
    if (this.character.isJumpingOnEnemy(enemy)) {
      return this.character.defeatEnemy(enemy);
    }

    if (!this.canBeHit()) return;

    this.character.setState(this.character.STATES.HURT);
    this.character.hurtUntil = Date.now() + 500;
    this.character.hit(10);
  }
}
