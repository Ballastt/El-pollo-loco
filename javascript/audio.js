// JavaScript for Start Screen and Game Logic

// Elements
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const learnButton = document.getElementById('learn-button');
const muteButton = document.getElementById('mute-button');
const startSound = document.getElementById('start-sound');

// Variable to track sound state
let isMuted = false;

// Function to start the game
function startGame() {
    // Hide the start screen
    startScreen.style.display = 'none';

    // Start the game logic (your existing game code)
    initializeGame();
}

// Function to show game instructions
function showInstructions() {
    alert('Welcome to the game! Here are the instructions:\n\n- Use arrow keys to move.\n- Avoid enemies and collect items.\n- Have fun!');
}

// Function to toggle mute/unmute
function toggleMute() {
    if (isMuted) {
        startSound.muted = false;
        muteButton.textContent = 'Mute';
    } else {
        startSound.muted = true;
        muteButton.textContent = 'Unmute';
    }
    isMuted = !isMuted;
}

// Event Listeners
startButton.addEventListener('click', startGame);
learnButton.addEventListener('click', showInstructions);
muteButton.addEventListener('click', toggleMute);

// Placeholder for game initialization
function initializeGame() {
    console.log('Game starts here!');
    // Add your game logic here (e.g., create the World instance and start the game loop)
}


window.addEventListener('load', () => {
    const startSound = document.getElementById('start-sound');
    const startButton = document.getElementById('start-button');

    // Unmute and play audio after user clicks "Start Game"
    startButton.addEventListener('click', () => {
        startSound.muted = false;
        startSound.play();
    });
});