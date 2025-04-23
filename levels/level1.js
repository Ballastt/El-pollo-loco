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

for (let i = -1; i <= 5; i++) {
    const position = i * 719;
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

const level1 = new Level(
    generateEnemies(),
    [
        new Cloud()
    ],
    backgroundObjects
);