/**
 * DOM Elements for the start screen and in-game controls.
 * These elements are used to toggle sound and start the game.
 */
const startScreen = document.getElementById("start-screen"); // The start screen container
const startButton = document.getElementById("start-button"); // Button to start the game
const learnButton = document.getElementById("learn-button"); // Button to show "about the game"
const muteButtonInGame = document.getElementById("mute-btn"); // In-game mute button (to mute)
const soundButtonInGame = document.getElementById("sound-btn"); // In-game unmute button (to unmute)

/**
 * Tracks whether the user has interacted with the page (required to start audio in browsers).
 * @type {boolean}
 */
let userInteracted = false;

/**
 * Global instance of the sound manager for handling audio playback.
 * @type {SoundManager}
 */
let soundManager;

/**
 * Initializes the global SoundManager with all game-related sounds.
 * Loads sounds with their paths, loop settings, and volume levels.
 */
function initializeSoundManager() {
  soundManager = new SoundManager();

  soundConfig.forEach(({ name, src, loop, volume }) => {
    soundManager.addSound(name, src, loop, volume);
  });

  soundManager.setVolume(localStorage.getItem("volume") || 1.0);
}

/**
 * Ensures the user has interacted with the page once.
 * This is necessary to allow audio playback in modern browsers.
 */
function ensureUserInteraction() {
  if (!userInteracted) {
    userInteracted = true;
  }
}

/**
 * Updates the visibility of in-game mute/unmute buttons.
 * @param {boolean} muted - Whether in-game sound is muted.
 */
function updateInGameMuteIcons(muted) {
  muteButtonInGame.style.display = muted ? "inline-block" : "none";
  soundButtonInGame.style.display = muted ? "none" : "inline-block";
}

function toggleSound() {
  if (soundManager.isMuted) {
    soundManager.unmute();
  } else {
    soundManager.mute();
  }

  updateInGameMuteIcons(soundManager.isMuted);
}

/**
 * Attaches event listeners to all mute/unmute buttons
 * for both the start screen and in-game interface.
 */
function setupMuteButtons() {
  [muteButtonInGame, soundButtonInGame].forEach((btn) => {
    btn?.addEventListener("click", () => {
      toggleSound();
    });
  });
}

/**
 * Initializes the start button with audio activation behavior.
 * Ensures user interaction is registered and background music is played.
 */
function setupStartButtonAudio() {
  if (startButton) {
    startButton.addEventListener("click", () => {
      ensureUserInteraction();
      if (!soundManager.isMuted) soundManager.play("backgroundMusic");
    });
  }
}

/**
 * Main entry point for audio initialization and UI setup.
 * This runs after the page has fully loaded.
 */
window.addEventListener("load", () => {
  initializeSoundManager();
  setupMuteButtons();
  setupStartButtonAudio();
  updateInGameMuteIcons(soundManager.isMuted);

  if (!soundManager.isMuted) {
    soundManager.unmute();
  }
});
