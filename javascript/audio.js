// JavaScript for Start Screen and Game Logic

// Elements
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const learnButton = document.getElementById("learn-button");
const muteButton = document.getElementById("mute-button");
const muteIcon = document.getElementById("mute");
const startSound = document.getElementById("start-sound");

// Variable to track sound state
let isMuted = false;

// Function to start the game
function startGame() {
  startScreen.style.display = "none";

  // Start the game logic (your existing game code)
  initializeGame();
}

// Function to show game instructions
function showInstructions() {
  alert(
    "Welcome to the game! Here are the instructions:\n\n- Use arrow keys to move.\n- Avoid enemies and collect items.\n- Have fun!"
  );
}

// Function to toggle mute/unmute
function toggleMute() {
  console.log("Mute button clicked!"); // Prüfen, ob der Button geklickt wurde

  if (!startSound) {
    console.error("Audio element not found!");
    return;
  }

  if (isMuted) {
    startSound.muted = false;
    muteIcon.src = "img/9_intro_outro_screens/start/sound-on.png";
    console.log("Sound unmuted");
  } else {
    startSound.muted = true;
    muteIcon.src = "img/9_intro_outro_screens/start/sound-off.png";
    console.log("Sound muted");
  }
  isMuted = !isMuted; // Zustand umschalten
}


// Event Listeners
startButton.addEventListener("click", startGame);
learnButton.addEventListener("click", showInstructions);
muteButton.addEventListener("click", toggleMute);
console.log()

// Placeholder for game initialization
function initializeGame() {
  console.log("Game starts here!");
  // Add your game logic here (e.g., create the World instance and start the game loop)
}

window.addEventListener("load", () => {
  const startSound = document.getElementById("start-sound");
  const startButton = document.getElementById("start-button");

  // Unmute and play audio after user clicks "Start Game"
  startButton.addEventListener("click", () => {
    startSound.muted = false;
    startSound.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  });
});


console.log("Start Button:", startButton);
console.log("Learn Button:", learnButton);
console.log("Mute Button:", muteButton);