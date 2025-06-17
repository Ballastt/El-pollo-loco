const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const learnButton = document.getElementById("learn-button");
const muteButton = document.getElementById("mute-button"); // Startscreen
const muteIcon = document.getElementById("muteStartScreen");
const muteButtonInGame = document.getElementById("mute-btn"); // Ingame Mute
const soundButtonInGame = document.getElementById("sound-btn"); // Ingame Unmute

let userInteracted = false;
let soundManager;
let isMutedStartScreen = true;
let isMutedInGame = false;

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

function ensureUserInteraction() {
  if (!userInteracted) {
    userInteracted = true;
    soundManager.unmute();
  }
}

function updateStartScreenMuteIcon(muted) {
  const newSrc = muted
    ? "img/9_intro_outro_screens/start/sound-off.png"
    : "img/9_intro_outro_screens/start/sound-on.png";
  muteIcon?.setAttribute("src", newSrc);
  console.log(newSrc);
}

function updateInGameMuteIcons(muted) {
  muteButtonInGame.style.display = muted ? "inline-block" : "none";
  soundButtonInGame.style.display = muted ? "none" : "inline-block";
}

/**
 * Startscreen-Mute/Unmute-Logik
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
 * Verknüpft alle Mute/Unmute-Buttons mit den richtigen Handlers.
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
 * Start-Button-Click-Logik inkl. Unmute
 */
function setupStartButtonAudio() {
  if (startButton) {
    startButton.addEventListener("click", () => {
      console.warn("[START BUTTON CLICKED]");
      ensureUserInteraction();
      isMutedStartScreen = false;
      updateStartScreenMuteIcon(isMutedStartScreen);

      if (!soundManager.isMuted) soundManager.play("backgroundMusic");
    });
  }
}

// === Entry Point ===
window.addEventListener("load", () => {
  initializeSoundManager();
  setupMuteButtons();
  setupStartButtonAudio();

  updateInGameMuteIcons(soundManager.isMuted);
  updateStartScreenMuteIcon(isMutedStartScreen);
});
