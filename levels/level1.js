/**
 * @constant {string[][]} layerSets
 * Two sets of background layer image paths for parallax effect.
 */
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

/**
 * Generates background objects based on the provided layer sets.
 * @param {string[][]} layerSets - Array of layer sets, each containing image paths.
 * @returns {BackgroundObject[]} Array of BackgroundObject instances with positions.
 */
function generateBackgroundObjects(layerSets) {
  const backgroundObjects = [];
  const numberOfBackgrounds = Math.ceil(6500 / 720);

  for (let i = -1; i < numberOfBackgrounds; i++) {
    const position = i * 719;
    const layerSet = layerSets[i % 2 === 0 ? 1 : 0];
    layerSet.forEach((layer) => {
      backgroundObjects.push(new BackgroundObject(layer, position));
    });
  }

  return backgroundObjects;
}

/**
 * Creates a single enemy instance (either SmallChicken or NormalChicken).
 * Assigns the shared enemies array reference to the instance.
 *
 * @param {number} x - The horizontal position to place the enemy.
 * @param {(SmallChicken|NormalChicken)[]} enemies - The shared array of enemy instances.
 * @returns {SmallChicken|NormalChicken} The newly created enemy instance.
 */
function createEnemy(x, enemies) {
  const EnemyClass = Math.random() < 0.3 ? SmallChicken : NormalChicken;
  const enemy = new EnemyClass(x, enemies);
  enemy.enemies = enemies;
  return enemy;
}

/**
 * Generates an array of enemy instances distributed across the level.
 * Each enemy is either a SmallChicken or NormalChicken placed with slight randomness.
 */
function generateEnemies() {
  const enemies = [];
  const amount = 30;
  const levelLength = 6800;
  const availableSpace = levelLength - 1000; 
  const spacing = availableSpace / amount;

  for (let i = 0; i < amount; i++) {
    const x = 1000 + i * spacing;
    enemies.push(createEnemy(x, enemies));
  }

  return enemies;
}

/**
 * Generates clouds with randomized positions and speeds.
 * @returns {Cloud[]} Array of Cloud instances.
 */
function generateClouds() {
  const clouds = [];
  const cloudDistance = 660; // 800px apart
  const numberOfClouds = Math.floor(7000 / cloudDistance);

  for (let i = 0; i <= numberOfClouds; i++) {
    const cloud = new Cloud();
    cloud.x = i * cloudDistance + Math.random() * 20;
    cloud.y = 0 + Math.random() * 30;
    cloud.speed = 1.1 + Math.random() * 0.35;
    clouds.push(cloud);
  }

  return clouds;
}

/**
 * Generates coins randomly positioned in a horizontal range.
 * @param {number} [maxCoins=40] Maximum number of coins to generate.
 * @returns {Coin[]} Array of Coin instances.
 */
function generateCoins(maxCoins = 40) {
  const coins = [];
  const coinDistance = 5700 / maxCoins;
  const startX = 300;

  for (let i = 0; i < maxCoins; i++) {
    const x = startX + i * coinDistance + Math.random() * 100;
    const y = 30 + Math.random() * 300;
    const coin = new Coin(x, y);
    coins.push(coin);
  }
  return coins;
}

/**
 * Generates collectible bottles randomly positioned in a horizontal range.
 * @param {number} [maxBottles=30] Maximum number of bottles to generate.
 * @returns {CollectableBottle[]} Array of CollectableBottle instances.
 */
function generateBottles(maxBottles = 20) {
  const bottles = [];
  const bottleDistance = 5700 / maxBottles;
  const startX = 300;

  for (let i = 0; i < maxBottles; i++) {
    const x = startX + i * bottleDistance + Math.random() * 100;
    const y = 30 + Math.random() * 300;
    bottles.push(new CollectableBottle(x, y));
  }
  return bottles;
}

/**
 * Global variable representing the first game level.
 * @type {Level}
 */
let level1;

/**
 * Initializes the first level with generated game objects.
 */
function initLevel() {
  level1 = new Level(
    generateEnemies(),
    generateClouds(),
    generateBackgroundObjects(layerSets),
    generateCoins(40),
    generateBottles(20)
  );
}
