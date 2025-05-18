// JavaScript for Start Screen and Game Logic

// Elements
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const learnButton = document.getElementById("learn-button");
const muteButton = document.getElementById("mute-button");
const muteIcon = document.getElementById("mute");
const startSound = document.getElementById("start-sound");
const muteButtonInGame = document.getElementById("mute-btn");
const soundButtonInGame = document.getElementById("sound-btn");

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

  // Update in-game buttons
  if (muteButtonInGame && soundButtonInGame) {
    muteButtonInGame.style.display = isMuted ? "none" : "inline-block";
    soundButtonInGame.style.display = isMuted ? "inline-block" : "none";
  }

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
  e.stopPropagation();
  toggleMute();
});

muteButtonInGame.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMute();
});

soundButtonInGame.addEventListener("click", (e) => {
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

// Set default sound state on load
window.addEventListener("load", () => {
  isMuted = false;
  userInteracted = false;
  startSound.muted = false;
  muteIcon.src = "img/9_intro_outro_screens/start/sound-on.png";

  // Make sure the correct button is shown at the start
  if (muteButtonInGame && soundButtonInGame) {
    muteButtonInGame.style.display = "inline-block";
    soundButtonInGame.style.display = "none";
  }

  console.log("Game loaded. Waiting for user interaction...");
});

function initializeSoundManager() {
  if (!window.soundManager) {
    window.soundManager = new SoundManager(); // global verfügbar
    soundManager.addSound("normalChickenWalking", "audio/normal_chicken_walking.mp3", true, 0.9);
    soundManager.addSound("normalChickenDeath", "audio/dying_chicken.mp3", false, 0.5);
    soundManager.addSound("smallChickenWalking", "audio/small_chicken_walking.mp3", true, 0.1);
    soundManager.addSound("smallChickenDeath", "audio/dying_chicken.mp3", false, 0.5);
    soundManager.addSound("chickenHit", "audio/hitting_a_chicken.mp3");
    soundManager.addSound("coinCollect", "audio/get_coin.mp3", false, 0.5);
    soundManager.addSound("bottleCollect", "audio/get_bottle.mp3", false, 0.5);
    soundManager.addSound("gamePause", "audio/pause.mp3");
    soundManager.addSound("gameResume", "audio/resume.mp3");
    soundManager.addSound("walkingSound", "audio/character_walk_on_sand.mp3");
    soundManager.addSound("jumpSound", "audio/character_jumping.mp3", false, 0.8);
    soundManager.addSound("hurtSound", "audio/pepe_hurting.mp3", false, 0.8);
    soundManager.setVolume(0.40);
    console.log("SoundManager erfolgreich initialisiert");
  }
}
