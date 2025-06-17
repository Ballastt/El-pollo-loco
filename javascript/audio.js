/**
 * DOM Elements for the start screen and in-game controls.
 * These elements are used to toggle sound and start the game.
 */
const startScreen = document.getElementById("start-screen"); // The start screen container
const startButton = document.getElementById("start-button"); // Button to start the game
const learnButton = document.getElementById("learn-button"); // Button to show "about the game"
const muteButton = document.getElementById("mute-button"); // Start screen mute button
const muteIcon = document.getElementById("muteStartScreen"); // Icon inside the start screen mute button
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
 * Tracks mute state for the start screen.
 * @type {boolean}
 */
let isMutedStartScreen = true;

/**
 * Tracks mute state during gameplay.
 * @type {boolean}
 */
let isMutedInGame = false;

/**
 * Initializes the global SoundManager with all game-related sounds.
 * Loads sounds with their paths, loop settings, and volume levels.
 */
function initializeSoundManager() {
  soundManager = new SoundManager();

  soundManager.addSound(
    "backgroundMusic",
    "audio/audio_start_screen.mp3",
    true,
    0.2
  );
  soundManager.addSound(
    "normalChickenWalking",
    "audio/normal_chicken_walking.mp3",
    true,
    0.4
  );
  soundManager.addSound("chickenDeath", "audio/dying_chicken.mp3", false, 0.8);
  soundManager.addSound(
    "smallChickenWalking",
    "audio/small_chicken_walking.mp3",
    true,
    0.8
  );
  soundManager.addSound("coinCollect", "audio/get_coin.mp3", false, 0.5);
  soundManager.addSound("bottleCollect", "audio/get_bottle.mp3", false, 0.5);
  soundManager.addSound(
    "walkingSound",
    "audio/character_walk_on_sand.mp3",
    true,
    1.0
  );
  soundManager.addSound("jumpSound", "audio/character_jumping.mp3", false, 0.8);
  soundManager.addSound("hurtSound", "audio/pepe_hurting.mp3", false, 0.8);
  soundManager.addSound("snoringPepe", "audio/pepe_snoring.mp3", false, 0.7);
  soundManager.addSound("PepeDying", "audio/pepe_dying.mp3", false, 0.6);
  soundManager.addSound(
    "introEndboss",
    "audio/endboss_intro_sound.mp3",
    false,
    1.0
  );
  soundManager.addSound(
    "endbossClucking",
    "audio/endboss_clucking.mp3",
    false,
    0.6
  );
  soundManager.addSound("endbossAngry", "audio/endboss_angry.mp3", false, 0.8);
  soundManager.addSound("endbossHurt", "audio/endboss_hurting.mp3", false, 0.7);
  soundManager.addSound("endbossDying", "audio/endboss_dying.mp3", false, 0.6);
  soundManager.addSound("bottleSplash", "audio/bottle_splash.mp3", false, 0.4);
  soundManager.addSound("gameWon", "audio/game_won.mp3", false, 0.9);
  soundManager.addSound("gameOver", "audio/game_over.mp3", false, 0.8);

  soundManager.setVolume(localStorage.getItem("volume") || 1.0);
}

/**
 * Ensures the user has interacted with the page once.
 * This is necessary to allow audio playback in modern browsers.
 */
function ensureUserInteraction() {
  if (!userInteracted) {
    userInteracted = true;
    soundManager.unmute(); // Enables audio system after first user gesture
  }
}

/**
 * Updates the mute icon on the start screen based on mute state.
 * @param {boolean} muted - Whether sound is currently muted.
 */
function updateStartScreenMuteIcon(muted) {
  const newSrc = muted
    ? "img/9_intro_outro_screens/start/sound-off.png"
    : "img/9_intro_outro_screens/start/sound-on.png";
  muteIcon?.setAttribute("src", newSrc);
}

/**
 * Updates the visibility of in-game mute/unmute buttons.
 * @param {boolean} muted - Whether in-game sound is muted.
 */
function updateInGameMuteIcons(muted) {
  muteButtonInGame.style.display = muted ? "inline-block" : "none";
  soundButtonInGame.style.display = muted ? "none" : "inline-block";
}

/**
 * Toggles sound on the start screen.
 * Starts/stops background music and updates the icon accordingly.
 */
function toggleStartScreenSound() {
  isMutedStartScreen = !isMutedStartScreen;

  if (isMutedStartScreen) {
    soundManager.stop("backgroundMusic");
  } else {
    soundManager.play("backgroundMusic");
  }

  updateStartScreenMuteIcon(isMutedStartScreen);
}

/**
 * Toggles in-game sound by pausing or resuming all sounds.
 * Updates button visibility accordingly.
 */
function toggleInGameSound() {
  isMutedInGame = !isMutedInGame;

  if (isMutedInGame) {
    soundManager.pauseAll();
  } else {
    soundManager.resumeAll();
  }

  updateInGameMuteIcons(isMutedInGame);
}

/**
 * Attaches event listeners to all mute/unmute buttons
 * for both the start screen and in-game interface.
 */
function setupMuteButtons() {
  muteButton?.addEventListener("click", () => {
    toggleStartScreenSound();
  });

  [muteButtonInGame, soundButtonInGame].forEach((btn) => {
    btn?.addEventListener("click", () => {
      toggleInGameSound();
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
      isMutedStartScreen = false;
      updateStartScreenMuteIcon(isMutedStartScreen);

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
  updateStartScreenMuteIcon(isMutedStartScreen);
});
