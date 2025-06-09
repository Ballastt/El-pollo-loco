/**
 * References to DOM elements related to the start screen and sound controls.
 * @type {HTMLElement|null}
 */
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const learnButton = document.getElementById("learn-button");
const muteButton = document.getElementById("mute-button");
const muteIcon = document.getElementById("muteStartScreen");
const muteButtonInGame = document.getElementById("mute-btn");
const soundButtonInGame = document.getElementById("sound-btn");

/**
 * Flag indicating if the user has interacted with the page (required for audio playback).
 * @type {boolean}
 */
let userInteracted = false;

/** @type {SoundManager} Global instance of the SoundManager */
let soundManager;

/** @type {boolean} Global mute state for UI syncing */
let isMuted = false;

/**
 * Initializes the SoundManager and loads all game sounds with appropriate settings.
 * This includes setting loop flags, individual volumes, and reading volume from localStorage.
 */
function initializeSoundManager() {
  soundManager = new SoundManager();

  // Start screen and ambient sounds
  soundManager.addSound("backgroundMusic", "audio/audio_start_screen.mp3", true, 0.2);
  soundManager.addSound("normalChickenWalking", "audio/normal_chicken_walking.mp3", true, 0.4);
  soundManager.addSound("chickenDeath", "audio/dying_chicken.mp3", false, 0.8);
  soundManager.addSound("smallChickenWalking", "audio/small_chicken_walking.mp3", true, 0.8);
  soundManager.addSound("coinCollect", "audio/get_coin.mp3", false, 0.5);
  soundManager.addSound("bottleCollect", "audio/get_bottle.mp3", false, 0.5);
  soundManager.addSound("walkingSound", "audio/character_walk_on_sand.mp3", true, 1.0);
  soundManager.addSound("jumpSound", "audio/character_jumping.mp3", false, 0.8);
  soundManager.addSound("hurtSound", "audio/pepe_hurting.mp3", false, 0.8);
  soundManager.addSound("snoringPepe", "audio/pepe_snoring.mp3", false, 0.7);
  soundManager.addSound("PepeDying", "audio/pepe_dying.mp3", false, 0.6);

  // Endboss sounds
  soundManager.addSound("introEndboss", "audio/endboss_intro_sound.mp3", false, 1.0);
  soundManager.addSound("endbossClucking", "audio/endboss_clucking.mp3", false, 0.6);
  soundManager.addSound("endbossAngry", "audio/endboss_angry.mp3", false, 0.8);
  soundManager.addSound("endbossHurt", "audio/endboss_hurting.mp3", false, 0.7);
  soundManager.addSound("endbossDying", "audio/endboss_dying.mp3", false, 0.6);

  // Game feedback sounds
  soundManager.addSound("bottleSplash", "audio/bottle_splash.mp3", false, 0.4);
  soundManager.addSound("gameWon", "audio/game_won.mp3", false, 0.9);
  soundManager.addSound("gameOver", "audio/game_over.mp3", false, 0.8);

  // Set default or saved volume
  soundManager.setVolume(localStorage.getItem('volume') || 1.0);
}

/**
 * Updates the mute icon on the start screen based on mute state.
 * @param {boolean} willBeMuted - The target mute state.
 */
function updateMuteState(willBeMuted) {
  const newSrc = willBeMuted
    ? "img/9_intro_outro_screens/start/sound-off.png"
    : "img/9_intro_outro_screens/start/sound-on.png";
  muteIcon.setAttribute("src", newSrc);
}

/**
 * Marks that the user has interacted with the page (required to start audio).
 */
function ensureUserInteraction() {
  if (!userInteracted) {
    userInteracted = true;
  }
}

/**
 * Handles toggling sound playback based on mute state and screen context.
 * @param {boolean} willBeMuted - Whether to mute or unmute.
 * @param {"startScreen"|"inGame"} source - Indicates the screen context.
 */
function handleSoundToggle(willBeMuted, source) {
  const isInGame = source === "inGame";

  ensureUserInteraction();

  if (willBeMuted) {
    isInGame ? soundManager.pauseAll() : soundManager.pause("backgroundMusic");
  } else {
    if (userInteracted) {
      isInGame ? soundManager.resumeAll() : soundManager.play("backgroundMusic");
    }
  }
}

/**
 * Updates visibility of mute/unmute buttons depending on mute state.
 * @param {boolean} willBeMuted - Whether the app is muted.
 */
function syncMuteUI(willBeMuted) {
  if (muteButtonInGame && soundButtonInGame) {
    muteButtonInGame.style.display = willBeMuted ? "inline-block" : "none";
    soundButtonInGame.style.display = willBeMuted ? "none" : "inline-block";
  }
}

/**
 * Adds click event listeners to all mute/unmute buttons in UI.
 * These buttons toggle mute state and update UI accordingly.
 */
function setupMuteButtons() {
  if (muteButton) {
    muteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      handleMuteToggle("startScreen");
    });
  }
  [muteButtonInGame, soundButtonInGame].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        handleMuteToggle("inGame");
      });
    }
  });
}

/**
 * Core toggle handler. Applies mute state, updates sound, and prepares UI.
 * @param {"startScreen"|"inGame"} source - Where the toggle was triggered from.
 */
function handleMuteToggle(source) {
  updateMuteState(isMuted);
  handleSoundToggle(isMuted, source);
  syncMuteUI(isMuted);
  isMuted = !isMuted;
}

/**
 * Enables background music when the start button is clicked and user interaction is detected.
 */
function setupStartButtonAudio() {
  if (startButton) {
    startButton.addEventListener("click", () => {
      ensureUserInteraction();
      setTimeout(() => {
        if (!soundManager.isMuted) {
          soundManager.play("backgroundMusic");
        }
      }, 100);
    });
  }
}

// App entry point
window.addEventListener("load", () => {
  initializeSoundManager();
  setupMuteButtons();
  setupStartButtonAudio();
  soundManager.unmute();          // Restore previous mute state
  updateMuteState(false);         // Update icon
  syncMuteUI(false);              // Set button visibility
});
