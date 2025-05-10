class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 6000;
    totalCoins = 0;
    totalBottles = 0;

    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;

        // Setze das Maximum der Coins basierend auf der Anzahl der Coins im Level
        this.totalCoins = coins.length;
        this.totalBottles = bottles.length;
    }

    regenerateEnemies() {
        this.enemies = generateEnemies();
    }
}