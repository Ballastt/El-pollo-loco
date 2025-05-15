function generateEnemies() {
  const enemies = [];
  const amount = 25; // Gesamtanzahl der Feinde
  const level_end_x = 6000;
  const startX = 600;

  // Schrittweite für gleichmäßige Verteilung
  const spacing = (level_end_x - startX) / amount;

  for (let i = 0; i < amount; i++) {
    // Basisposition: gleichmäßige Verteilung entlang der Strecke
    const baseX = startX + i * spacing;

    // Zufällige Abweichung, aber begrenzt auf 5% der Schrittweite
    const randomness = spacing * 0.05; // 5% der Schrittweite
    const x = baseX + (Math.random() - 0.5) * randomness;

    // Erstelle entweder ein SmallChicken oder ein NormalChicken mit Gewichtung
    const enemy =
      Math.random() < 0.7
        ? new NormalChicken(x, enemies) // 70% Wahrscheinlichkeit für NormalChicken
        : new SmallChicken(x, enemies); // 30% Wahrscheinlichkeit für SmallChicken

    // Setze das enemies-Array korrekt
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