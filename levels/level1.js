const backgroundObjects = [];
const layerSets = [
  [
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/2.png",
    "img/5_background/layers/2_second_layer/2.png",
    "img/5_background/layers/1_first_layer/2.png",
  ],
  [
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/1.png",
    "img/5_background/layers/2_second_layer/1.png",
    "img/5_background/layers/1_first_layer/1.png",
  ],
];

//Calculate layers needed to fill level width
const numberOfBackgrounds = Math.ceil(6500 / 720);
for (let i = -1; i < numberOfBackgrounds; i++) {
  const position = i * 719; //repeating the layer
  const layerSet = layerSets[i % 2 === 0 ? 1 : 0]; // Alternate between sets
  layerSet.forEach((layer) => {
    backgroundObjects.push(new BackgroundObject(layer, position));
  });
}

function generateEnemies() {
  const enemies = [];
  const amount = 25;
  const level_end_x = 6000;
  const startX = 600;
  const spacing = (level_end_x - startX) / amount;

  for (let i = 0; i < amount; i++) {
    const baseX = startX + i * spacing;
    const x = baseX + (Math.random() - 0.5) * spacing * 0.3;

    // Hier wird das enemies-Array korrekt übergeben
    const enemy =
      Math.random() < 0.5
        ? new SmallChicken(x, enemies)
        : new NormalChicken(x, enemies);

    // Jetzt das enemies-Array korrekt setzen
    enemy.enemies = enemies;

    enemies.push(enemy);
  }

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

function generateCoins(maxCoins = 40) {
  const coins = [];
  const coinDistance = 5700 / maxCoins;
  const startX = 300;

  for (let i = 0; i < maxCoins; i++) {
    const x = startX + i * coinDistance + Math.random() * 100; // Zufällige Position im Bereich
    const y = 30 + Math.random() * 300;

    // Erstelle den Coin mit x und y
    const coin = new Coin(x, y);
    coins.push(coin);
  }

  return coins;
}

function generateBottles(maxBottles = 30) {
  const bottles = [];
  const bottleDistance = 5700 / maxBottles;
  const startX = 300; // Startposition der Flaschen (nach der Statusbar)

  for (let i = 0; i < maxBottles; i++) {
    const x = startX + i * bottleDistance + Math.random() * 100; // Zufällige Position im Bereich
    const y = 30 + Math.random() * 300; // Zufällige Höhe zwischen 100px und 300px
    bottles.push(new CollectableBottle(x, y));
  }

  return bottles;
}

const level1 = new Level(
  generateEnemies(),
  generateClouds(),
  backgroundObjects,
  generateCoins(40),
  generateBottles(30)
);
