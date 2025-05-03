let canvas;
let world;
let keyboard = new Keyboard();
let level;

function init() {
    canvas = document.getElementById('canvas');
    keyboard = new Keyboard();
    world = new World(canvas, keyboard);
    
   
    console.log("my character is", world.character);
    
}


window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        keyboard.RIGHT = true;
    }
    if (e.key === 'ArrowLeft') {
        keyboard.LEFT = true;
    }
    if (e.key === 'ArrowUp') {
        keyboard.UP = true;
    }
    if (e.key === 'ArrowDown') {
        keyboard.DOWN = true;
    }
    if (e.key === ' ') {
        keyboard.SPACE = true;
        console.log('SPACE pressed', keyboard);
    }
    if (e.key === 'd' || e.key === 'D') { // Taste D hinzufügen
        keyboard.D = true;
        console.log('D pressed', keyboard);
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') {
        keyboard.RIGHT = false;
    }
    if (e.key === 'ArrowLeft') {
        keyboard.LEFT = false;
    }
    if (e.key === 'ArrowUp') {
        keyboard.UP = false;
    }
    if (e.key === 'ArrowDown') {
        keyboard.DOWN = false;
    }
    if (e.key === ' ') {
        keyboard.SPACE = false;
        console.log('SPACE released', keyboard);
    }
    if (e.key === 'd' || e.key === 'D') { // Taste D hinzufügen
        keyboard.D = false;
        console.log('D released', keyboard);
    }
});
