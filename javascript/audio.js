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
let userInteracted = false;

// Function to toggle mute/unmute
function toggleMute() {
  if (!startSound) return console.error("Audio element not found!");

  isMuted = !isMuted;
  startSound.muted = isMuted;
  muteIcon.src = isMuted
    ? "img/9_intro_outro_screens/start/sound-off.png"
    : "img/9_intro_outro_screens/start/sound-on.png";

  console.log("Sound is now", isMuted ? "muted" : "unmuted");
}

// Function to enable global audio playback
function enableAudioPlayback() {
  if (!userInteracted) {
    userInteracted = true;
    console.log("Audio playback enabled");

    // Hier könntest du alle anderen Sounds auch starten, wenn nötig
    document.dispatchEvent(new Event("audio-enabled"));
  }
}

// Event Listeners
muteButton.addEventListener("click", (e) => {
  // Verhindere, dass dies die Spiel-Audio-Aktivierung triggert
  e.stopPropagation();
  toggleMute();
});

// Erst nach Benutzerinteraktion versuchen, Sound zu starten
startButton.addEventListener("click", () => {
  enableAudioPlayback();
  if (!isMuted) {
    startSound.muted = false;
    startSound.play().catch((error) => {
      console.error("Error playing start sound:", error);
    });
  }
});

window.addEventListener("load", () => {
  // Set default sound state
  isMuted = false;
  userInteracted = false;
  startSound.muted = false;
  muteIcon.src = "img/9_intro_outro_screens/start/sound-on.png";

  console.log("Game loaded. Waiting for user interaction...");
});
