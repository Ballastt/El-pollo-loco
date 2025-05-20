// JavaScript for Start Screen and Game Logic

// Elements
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const learnButton = document.getElementById("learn-button");
const muteButton = document.getElementById("mute-button");
const muteIcon = document.getElementById("mute");
const muteButtonInGame = document.getElementById("mute-btn");
const soundButtonInGame = document.getElementById("sound-btn");

// Variable to track sound state
let isMuted = false;
let userInteracted = false;

// Function to toggle mute/unmute
function toggleMute() {
  isMuted = !isMuted;

  isMuted ? soundManager.mute() : soundManager.unmute();

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

function setupMuteButtons() {
  const muteButtons = [muteButton, muteButtonInGame, soundButtonInGame];
  muteButtons.forEach((button) => {
    if (button) {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMute();
      });
    }
  });
}

function setupStartButton() {
  if (startButton) {
    startButton.addEventListener("click", () => {
      enableAudioPlayback();

      if (!isMuted) {
        soundManager.play("backgroundMusic");
      }
    });
  }
}

function setupEventListeners() {
  setupMuteButtons();
  setupStartButton();
}

// Set default sound state on load
window.addEventListener("load", () => {
  isMuted = false;
  userInteracted = false;
  soundManager.unmute();
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
    soundManager.addSound(
      "backgroundMusic",
      "audio/audio_start_screen.mp3",
      true,
      0.3
    ); // loop=true

    soundManager.addSound(
      "normalChickenWalking",
      "audio/normal_chicken_walking.mp3",
      true,
      0.2
    );
    soundManager.addSound(
      "chickenDeath",
      "audio/dying_chicken.mp3",
      false,
      0.8
    );
    soundManager.addSound(
      "smallChickenWalking",
      "audio/small_chicken_walking.mp3",
      true,
      0.05
    );
    soundManager.addSound(
      "chickenHit",
      "audio/hitting_a_chicken.mp3",
      false,
      0.6
    );
    soundManager.addSound("coinCollect", "audio/get_coin.mp3", false, 0.5);
    soundManager.addSound("bottleCollect", "audio/get_bottle.mp3", false, 0.5);
    soundManager.addSound(
      "walkingSound",
      "audio/character_walk_on_sand.mp3",
      true,
      1.0
    );
    soundManager.addSound(
      "jumpSound",
      "audio/character_jumping.mp3",
      false,
      0.8
    );
    soundManager.addSound("hurtSound", "audio/pepe_hurting.mp3", false, 0.8);
    soundManager.addSound("snoringPepe", "audio/pepe_snoring.mp3", false, 0.4);
    soundManager.addSound(
      "introEndboss",
      "audio/endboss_intro_sound.mp3",
      false,
      1.0
    );
    soundManager.setVolume(0.8);
    console.log("SoundManager erfolgreich initialisiert");
    setupEventListeners();
  }
}
