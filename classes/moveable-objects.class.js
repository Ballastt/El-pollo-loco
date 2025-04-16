class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 150;
    width = 100;

    //loadImage()
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    //Schablone (wie ein JSON)
    moveRight(){
        console.log("Moving right");
    }

    
    moveLeft() {
        console.log("moving left");
        
    }
}