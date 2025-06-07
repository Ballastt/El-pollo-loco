/**
 * References to DOM elements related to the start screen and sound controls.
 * @type {HTMLElement|null}
 */
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const learnButton = document.getElementById("learn-button");
const muteButton = document.getElementById("mute-button");
const muteIcon = document.getElementById("mute");
const muteButtonInGame = document.getElementById("mute-btn");
const soundButtonInGame = document.getElementById("sound-btn");

/**
 * Flag to indicate if the user has interacted to enable audio playback.
 * @type {boolean}
 */
let userInteracted = false;

/**
 * Toggles the mute state:
 * - Mutes or unmutes the sound via soundManager.
 * - Updates the mute icon image.
 * - Shows or hides in-game mute and sound buttons accordingly.
 */
function toggleMute() {
  isMuted = !isMuted;

  isMuted ? soundManager.mute() : soundManager.unmute();

  muteIcon.src = isMuted
    ? "img/9_intro_outro_screens/start/sound-off.png"
    : "img/9_intro_outro_screens/start/sound-on.png";

  if (muteButtonInGame && soundButtonInGame) {
    muteButtonInGame.style.display = isMuted ? "none" : "inline-block";
    soundButtonInGame.style.display = isMuted ? "inline-block" : "none";
  }
}

function isMuted() {
  return soundManager?.isMuted ?? false;
}

/**
 * Attaches click event listeners to all mute buttons
 * to toggle mute on user interaction.
 */
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

/**
 * Sets up the start button to:
 * - Enable audio playback on first click.
 * - Play background music if not muted.
 */
function setupStartButton() {
  if (startButton) {
    startButton.addEventListener("click", () => {
      if (!userInteracted) userInteracted = true;
      // Wait a tick to ensure all sounds are initialized
      setTimeout(() => {
        console.log("User interaction status:", userInteracted);

        if (!isMuted) {
          soundManager.play("backgroundMusic");
        }
      }, 100); // short delay ensures everything is settled
    });
  }
}

/**
 * Sets up all relevant event listeners for sound controls and start button.
 */
function setupEventListeners() {
  setupMuteButtons();
  setupStartButton();
}

/**
 * Sets default sound state on window load:
 * - Unmutes sound.
 * - Updates mute icon.
 * - Adjusts visibility of in-game mute and sound buttons.
 */
window.addEventListener("load", () => {
  soundManager.unmute();
  muteIcon.src = "img/9_intro_outro_screens/start/sound-on.png";

  if (muteButtonInGame && soundButtonInGame) {
    muteButtonInGame.style.display = "inline-block";
    soundButtonInGame.style.display = "none";
  }
});

/**
 * Initializes the global soundManager instance if not already defined,
 * adds all game sounds with their respective properties,
 * sets initial volume,
 * and sets up necessary event listeners.
 */
function initializeSoundManager() {
  if (!window.soundManager) {
    window.soundManager = new SoundManager(); // globally available

    soundManager.addSound(
      "backgroundMusic",
      "audio/audio_start_screen.mp3",
      true,
      0.2
    ); // loop = true

    soundManager.addSound(
      "normalChickenWalking",
      "audio/normal_chicken_walking.mp3",
      true,
      0.4
    );
    soundManager.addSound("chickenDeath", "audio/dying_chicken.mp3", true, 0.8);
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
    soundManager.addSound(
      "jumpSound",
      "audio/character_jumping.mp3",
      false,
      0.8
    );
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
    soundManager.addSound(
      "endbossAngry",
      "audio/endboss_angry.mp3",
      false,
      0.8
     ); 
    soundManager.addSound(
      "endbossHurt",
      "audio/endboss_hurting.mp3",
      false,
      0.7
    );
    soundManager.addSound("endbossDying", "audio/endboss_dying.mp3", false, 0.6);
    soundManager.addSound(
      "bottleSplash",
      "audio/bottle_splash.mp3",
      false,
      0.4
    );
    soundManager.addSound("gameWon", "audio/game_won.mp3", false, 0.9);
    soundManager.addSound("gameOver", "audio/game_over.mp3", false, 0.8);

    soundManager.setVolume(0.8);
  }
  setupEventListeners();
}
