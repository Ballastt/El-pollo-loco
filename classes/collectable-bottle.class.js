class CollectableBottle extends CollectableObject {
    constructor(x, y) {
        super(x, y, 50, 50); // Position und Größe der Flasche
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png'); // Lade das Bild der Flasche
    }
}