class StatusBar extends DrawableObject{
    images = []; // Bilder für diese StatusBar
    percentage = 100; // Standardwert für abwärtszählende Statusbars
    isReversed = false; // Legt fest, ob die Logik für die CoinBar umgekehrt ist

    constructor(images, x, y, width, height, isReversed = false) {
        super(); //ruft den Konstruktor der drawable Klasse auf
        this.images = images;
        this.loadImages(this.images);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.reversed = isReversed;

        setTimeout(() => {
            this.setPercentage(isReversed ? 0 : 100);
        }, 50); // 50ms reichen oft aus
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.images[this.resolveImageIndex()];
        this.img = this.imageCache[path];
        if (!this.img) {
            console.error(`Image not found for percentage: ${percentage}, path: ${path}`);
        } else {
            console.log(`StatusBar image set for ${percentage}%: ${path}`);
        }
    }
    
    resolveImageIndex() {
        if (this.isReversed) {
            // Logik für aufwärtszählende StatusBar (CoinBar)
            if (this.percentage >= 100) return 5;
            if (this.percentage > 80) return 4;
            if (this.percentage > 60) return 3;
            if (this.percentage > 40) return 2;
            if (this.percentage > 20) return 1;
            return 0;
        } else {
            // Standard-Logik (abwärtszählende StatusBars)
            if (this.percentage == 100) return 5;
            if (this.percentage > 80) return 4;
            if (this.percentage > 60) return 3;
            if (this.percentage > 40) return 2;
            if (this.percentage > 20) return 1;
            return 0;
        }
    }
}