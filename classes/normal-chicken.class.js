class NormalChicken extends Chicken {
  constructor() {
    super(
      "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
      [
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
      ],
      ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"],
      55,
      55,
      [0.35, 0.65]
    );
    this.y = 362;
  }
}
