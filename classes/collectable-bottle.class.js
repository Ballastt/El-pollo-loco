class CollectableBottle extends CollectableObject {
  constructor(x, y) {
    super(x, y, 70, 50); // Position und Größe der Flasche
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png"); // Lade das Bild der Flasche

    this.hitbox = {
      offsetX: 23, //Verschiebung der Hitbox nach rechts
      offsetY: 6, //Verschiebung der Hitbox nach unten
      width: 25,
      height: 40,
    };
  }
}
