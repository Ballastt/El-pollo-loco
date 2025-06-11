class StatusBarManager {
  constructor(world) {
    this.world = world;
  }

  /**
   * Updates the throw bar UI based on collected bottles.
   */
  updateThrowBar() {
    const maxBottles = this.level.totalBottles || 30;
    const percentage = (this.character.collectedBottles / maxBottles) * 100;
    this.throwBar.setPercentage(percentage);
  }

  /**
   * Updates the coin bar UI based on collected coins.
   */
  updateCoinBar() {
    const maxCoins = this.level.totalCoins || 40;
    const percentage = (this.character.collectedCoins / maxCoins) * 100;
    this.coinBar.setPercentage(percentage);
  }

  /**
   * Updates the health bar UI based on character health.
   */
  updateHealthBar() {
    const maxHealth = this.level.maxHealth || 100;
    const percentage = (this.character.health / maxHealth) * 100;
    this.healthBar.setPercentage(percentage);
  }
}
