class SmallChicken extends Chicken {
  constructor() {
    super(
      "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
      [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
      ],
      ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"],
      35,
      35,
      [0.45, 0.8]
    );
    this.y = 380;
  }
}
