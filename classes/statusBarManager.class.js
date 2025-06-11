class StatusBarManager {
  constructor(world) {
    this.world = world;
  }

  /**
   * Updates the throw bar UI based on collected bottles.
   */
  updateThrowBar() {
    const maxBottles = this.world.level?.totalBottles || 30;
    const percentage =
      (this.world.character.collectedBottles / maxBottles) * 100;
    this.world.throwBar.setPercentage(percentage);
  }

  /**
   * Updates the coin bar UI based on collected coins.
   */
  updateCoinBar() {
    const maxCoins = this.world.level?.totalCoins || 40;
    const percentage = (this.world.character.collectedCoins / maxCoins) * 100;
    this.world.coinBar.setPercentage(percentage);
  }

  /**
   * Updates the health bar UI based on character health.
   */
  updateHealthBar() {
    const maxHealth = this.world.level?.maxHealth || 100;
    const percentage = (this.world.character.health / maxHealth) * 100;
    this.world.healthBar.setPercentage(percentage);
  }
}
