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

// Function to toggle mute/unmute
function toggleMute() {
  if (!startSound) return console.error("Audio element not found!");

  if (isMuted) {
    startSound.muted = false;
    muteIcon.src = "img/9_intro_outro_screens/start/sound-on.png";
  } else {
    startSound.muted = true;
    muteIcon.src = "img/9_intro_outro_screens/start/sound-off.png";
  }
  isMuted = !isMuted; // Zustand umschalten
}



// Event Listeners
muteButton.addEventListener("click", toggleMute);

window.addEventListener("load", () => {
  // Standardwerte setzen
  isMuted = false;
  startSound.muted = false;
  muteIcon.src = "img/9_intro_outro_screens/start/sound-on.png";

  // Versuche, den Ton abzuspielen
  startSound.play().catch((error) => {
    console.warn("Autoplay blockiert: Benutzerinteraktion erforderlich, um den Sound abzuspielen.");
  });

  // Unmute and play audio after user clicks "Start Game"
  startButton.addEventListener("click", () => {
    isMuted = false;
    startSound.muted = false;
    muteIcon.src = "img/9_intro_outro_screens/start/sound-on.png";
    startSound.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  });
});