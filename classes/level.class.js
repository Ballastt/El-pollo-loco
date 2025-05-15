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
        // Sicherheitsprüfungen: Fallback auf leere Arrays
        this.enemies = enemies || [];
        this.clouds = clouds || [];
        this.backgroundObjects = backgroundObjects || [];
        this.coins = coins || [];
        this.bottles = bottles || [];

        // Setze das Maximum der Coins und Bottles
        this.totalCoins = this.coins.length;
        this.totalBottles = this.bottles.length;
    }

    regenerateEnemies() {
        this.enemies = generateEnemies();
    }
}