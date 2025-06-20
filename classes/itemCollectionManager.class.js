class ItemCollectionManager {
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks for coin collection by the character.
   */
  checkCoinCollection() {
    this.checkItemCollection("Coin", {
      items: this.world.level.coins,
      characterProperty: "collectedCoins",
      sound: "coinCollect",
      bar: this.world.coinBar,
      maxItems: this.world.level.totalCoins,
      onCollect: () => {
        this.world.character.collectedCoins++;
        this.world.statusBarManager.updateCoinBar();
      },
    });
  }

  /**
   * Checks for bottle collection by the character.
   */
  checkBottleCollection() {
    this.checkItemCollection("Bottle", {
      items: this.world.level.bottles,
      characterProperty: "collectedBottles",
      sound: "bottleCollect",
      bar: this.world.throwBar,
      maxItems: this.world.level.totalBottles,
      onCollect: () => {
        this.world.character.collectedBottles++;
        this.world.statusBarManager.updateThrowBar();
      },
    });
  }

  /**
   * Checks for item collection (coins or bottles) and updates state/UI.
   * @param {string} itemType - The type of item ("Coin" or "Bottle").
   * @param {Object} options - Collection options.
   * @param {Array} options.items - The array of items to check.
   * @param {string} options.characterProperty - The property to increment on the character.
   * @param {string} options.sound - The sound key to play on collection.
   * @param {StatusBar} options.bar - The status bar to update.
   * @param {number} options.maxItems - The maximum number of items.
   * @param {Function} options.onCollect - Callback to run on collection.
   */
  checkItemCollection(itemType, options) {
    const { items, characterProperty, sound, bar, maxItems, onCollect } =
      options;

    items.forEach((item, index) => {
      if (this.world.character.isColliding(item)) {
        items.splice(index, 1);
        if (onCollect) onCollect();
        if (sound && soundManager) soundManager?.play(sound);
        if (bar && maxItems) {
          const percentage =
            (this.world.character[characterProperty] / maxItems) * 100;
          bar.setPercentage(percentage);
        }
      }
    });
  }
}
