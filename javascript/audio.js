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
 * Flag to indicate if the user has interacted to enable audio playback.
 * @type {boolean}
 */
let userInteracted = false;
let soundManager;
let isMuted = false;

/**
 * Initializes the global soundManager instance if not already defined,
 * adds all game sounds with their respective properties,
 * sets initial volume,
 * and sets up necessary event listeners.
 */
/** ⬇️ Nur Soundobjekte laden, sonst nix */
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

  soundManager.setVolume(localStorage.getItem('volume') || 1.0);
}

function updateMuteState(willBeMuted) {
  const newSrc = willBeMuted
    ? "img/9_intro_outro_screens/start/sound-off.png"
    : "img/9_intro_outro_screens/start/sound-on.png";
  muteIcon.setAttribute("src", newSrc);
  console.log("🔁 Icon gewechselt zu:", newSrc);
}

function ensureUserInteraction() {
  if (!userInteracted) {
    userInteracted = true;
    console.log("🟢 Erste Nutzerinteraktion erkannt");
  }
}

function handleSoundToggle(willBeMuted, source) {
  const isInGame = source === "inGame";
  console.log("🎵 toggleBackgroundMusic: willBeMuted =", willBeMuted);

  ensureUserInteraction();

  if (willBeMuted) {
    isInGame ? soundManager.pauseAll() : soundManager.pause("backgroundMusic");
  } else {
    if (userInteracted) {
      isInGame
        ? soundManager.resumeAll()
        : soundManager.play("backgroundMusic");
    }
  }
}

function syncMuteUI(willBeMuted) {
  if (muteButtonInGame && soundButtonInGame) {
    muteButtonInGame.style.display = willBeMuted ? "inline-block" : "none";
    soundButtonInGame.style.display = willBeMuted ? "none" : "inline-block";
  }
}

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

function handleMuteToggle(source) {
  // Use current mute state
  updateMuteState(isMuted);
  handleSoundToggle(isMuted, source);
  syncMuteUI(isMuted);

  // Flip for the *next* click
  isMuted = !isMuted;
}

function setupStartButtonAudio() {
  if (startButton) {
    startButton.addEventListener("click", () => {
      ensureUserInteraction();
      setTimeout(() => {
        console.log("User interaction status:", userInteracted);
        if (!soundManager.isMuted) {
          soundManager.play("backgroundMusic");
        }
      }, 100);
    });
  }
}

window.addEventListener("load", () => {
  initializeSoundManager();
  setupMuteButtons();
  setupStartButtonAudio();
  soundManager.unmute();
  updateMuteState(false);
  syncMuteUI(false);
});
