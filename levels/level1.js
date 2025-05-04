const backgroundObjects = [];
const layerSets = [
    [
        'img/5_background/layers/air.png',
        'img/5_background/layers/3_third_layer/2.png',
        'img/5_background/layers/2_second_layer/2.png',
        'img/5_background/layers/1_first_layer/2.png',
    ],
    [
        'img/5_background/layers/air.png',
        'img/5_background/layers/3_third_layer/1.png',
        'img/5_background/layers/2_second_layer/1.png',
        'img/5_background/layers/1_first_layer/1.png',
    ],
];

//Calculate layers needed to fill level width
const numberOfBackgrounds = Math.ceil(6500 / 720);
for (let i = -1; i < numberOfBackgrounds; i++) {
    const position = i * 719; //repeating the layer
    const layerSet = layerSets[i % 2 === 0 ? 1 : 0]; // Alternate between sets
    layerSet.forEach(layer => {
        backgroundObjects.push(new BackgroundObject(layer, position));
    });
}


function generateEnemies() {
    const enemies = [];

    const amount = 15;
    for (let i = 0; i < amount; i++) {
        const isSmall = Math.random() < 0.5;
        const x = 400 + Math.random() * 5000;

        if (isSmall) {
            enemies.push(new SmallChicken(x));
        } else {
            enemies.push(new NormalChicken(x));
        }
    }

    enemies.push(new Endboss());

    return enemies;
}


function generateClouds() {
    const clouds = [];

    const cloudDistance = 660; // 800px apart
    const numberOfClouds = Math.floor(7000 / cloudDistance);

    for (let i = 0; i <= numberOfClouds; i++) {
        const cloud = new Cloud();
        cloud.x = i * cloudDistance + Math.random() * 20; // only small random
        cloud.y = 0 + Math.random() * 30; // between 30 and 70px (higher sky)
        cloud.speed = 1.1 + Math.random() * 0.35;
        clouds.push(cloud);
    }

    return clouds;
}


function generateCoins(maxCoins = 100) {
    const coins = [];
    const coinDistance = 200; // Abstand zwischen den Coins
    const numberOfCoins = Math.min(maxCoins, Math.floor(5900 / coinDistance)); 
    const statusBarWidth = 250; // Breite der Statusbar

    for (let i = 0; i <= numberOfCoins; i++) {
        let x;
        if (i === 0) {
            // Für den ersten Coin: Stelle sicher, dass er außerhalb der Statusbar liegt
            x = statusBarWidth + 10; // StatusBar + Coin-Breite + Puffer
            console.log('First Coin X-Position:', x); // Debugging
        } else {
            // Normale Position für andere Coins
            x = i * coinDistance + Math.random() * 50;
        }

        // Berechne die y-Position (z. B. zufällig)
        const y = 30 + Math.random() * 300;

        // Erstelle den Coin mit x und y
        const coin = new Coin(x, y);
        coins.push(coin);
    }

    return coins;
}

function generateBottles(maxBottles = 25) {
    const bottles = [];
    const bottleDistance = 250; // Abstand zwischen Flaschen
    const numberOfBottles = Math.min(maxBottles, Math.floor(5900 / bottleDistance)); 
    const startX = 300; // Startposition der Flaschen (nach der Statusbar)

    for (let i = 0; i < numberOfBottles; i++) {
        const x = startX + i * bottleDistance + Math.random() * 100; // Zufällige Position im Bereich
        const y = 40 + Math.random() * 300; // Zufällige Höhe zwischen 100px und 300px
        bottles.push(new CollectableBottle(x, y));
    }

    return bottles;
}


const level1 = new Level(
    generateEnemies(),
    generateClouds(),
    backgroundObjects,
    generateCoins(),
    generateBottles()
);