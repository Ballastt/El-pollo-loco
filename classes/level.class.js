class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    level_end_x = 6000;
    totalCoins = 0;

    constructor(enemies, clouds, backgroundObjects, coins) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;

        // Setze das Maximum der Coins basierend auf der Anzahl der Coins im Level
        this.totalCoins = coins.length;
    }
}