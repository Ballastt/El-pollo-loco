class CollisionManager {
  constructor(world, character, endboss, throwableObjects, gameManager) {
    this.world = world;
    this.character = character;
    this.endboss = endboss;
    this.throwableObjects = throwableObjects;
    this.gameManager = gameManager;
  }

  /**
   * Checks for collisions between the character and enemies/endboss, and updates health bar.
   */
  checkCollisions() {
    if (!this.gameManager.isGameRunning) return;

    this.character.checkCollisionsWithEnemy(this.world.level.enemies);
    this.character.checkCollisionsWithEndboss(this.endboss);

    this.world.statusBarManager.updateHealthBar();
  }

  /**
   * Handles collisions between bottles and enemies/endboss.
   */
  bottleEnemyCollision() {
    this.handleBottleHitsForEnemies();
    this.handleBottleHitForEndboss();
  }

  /**
   * Handles bottle collisions with enemies.
   */
  handleBottleHitsForEnemies() {
    if (!this.gameManager.isGameRunning) return;

    this.throwableObjects.forEach((bottle, bottleIndex) => {
      this.world.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isDead) {
          enemy.die();
          this.throwableObjects.splice(bottleIndex, 1);
        }
      });
    });
  }

  /**
   * Handles bottle collisions with the endboss.
   */
  handleBottleHitForEndboss() {
    if (!this.gameManager.isGameRunning) return;

    this.throwableObjects.forEach((bottle, bottleIndex) => {
      if (
        this.endboss &&
        bottle.isColliding(this.endboss) &&
        !this.endboss.isDead
      ) {
        this.endboss.hurt(20);
        this.throwableObjects.splice(bottleIndex, 1);
      }
    });
  }
}
