let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    keyboard = new Keyboard();
    world = new World(canvas, keyboard);
    
   
    console.log("my character is", world.character);
    
}


window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        keyboard.RIGHT = true;
        console.log('RIGHT pressed', keyboard);
    }
    if (e.key === 'ArrowLeft') {
        keyboard.LEFT = true;
        console.log('LEFT pressed', keyboard);
    }
    if (e.key === 'ArrowUp') {
        keyboard.UP = true;
        console.log('UP pressed', keyboard);
    }
    if (e.key === 'ArrowDown') {
        keyboard.DOWN = true;
        console.log('DOWN pressed', keyboard);
    }
    if (e.key === ' ') {
        keyboard.SPACE = true;
        console.log('SPACE pressed', keyboard);
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') {
        keyboard.RIGHT = false;
        console.log('RIGHT released', keyboard);
    }
    if (e.key === 'ArrowLeft') {
        keyboard.LEFT = false;
        console.log('LEFT released', keyboard);
    }
    if (e.key === 'ArrowUp') {
        keyboard.UP = false;
        console.log('UP released', keyboard);
    }
    if (e.key === 'ArrowDown') {
        keyboard.DOWN = false;
        console.log('DOWN released', keyboard);
    }
    if (e.key === ' ') {
        keyboard.SPACE = false;
        console.log('SPACE released', keyboard);
    }
});
