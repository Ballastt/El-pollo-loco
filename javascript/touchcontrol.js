/**
 * Sets up touch controls for mobile devices.
 * Maps directional and action buttons to the `keyboard` object.
 */
document
  .getElementById("btn-left")
  ?.addEventListener("touchstart", () => (keyboard.LEFT = true));
document
  .getElementById("btn-left")
  ?.addEventListener("touchend", () => (keyboard.LEFT = false));

document
  .getElementById("btn-right")
  ?.addEventListener("touchstart", () => (keyboard.RIGHT = true));
document
  .getElementById("btn-right")
  ?.addEventListener("touchend", () => (keyboard.RIGHT = false));

document
  .getElementById("btn-jump")
  ?.addEventListener("touchstart", () => (keyboard.UP = true));
document
  .getElementById("btn-jump")
  ?.addEventListener("touchend", () => (keyboard.UP = false));

document
  .getElementById("btn-throw")
  ?.addEventListener("touchstart", () => (keyboard.SPACE = true));
document
  .getElementById("btn-throw")
  ?.addEventListener("touchend", () => (keyboard.SPACE = false));

/**
 * Adds event listeners to pause and resume game using UI buttons.
 * Toggles visibility between pause and play buttons.
 */
function togglePausePlay() {
  const btnPause = document.getElementById("btn-pause");
  const btnPlay = document.getElementById("btn-play");

  btnPause?.addEventListener("click", () => {
    gameManager.togglePause();
    btnPause.classList.add("hidden");
    btnPlay.classList.remove("hidden");
  });

  btnPlay?.addEventListener("click", () => {
    gameManager.togglePause();
    btnPlay.classList.add("hidden");
    btnPause.classList.remove("hidden");
  });
}

/**
 * Adds event listeners to mute and unmute game audio using UI buttons.
 * Toggles visibility between mute and unmute buttons.
 */
function toggleMuteUnmute() {
  const btnMute = document.getElementById("btn-mute");
  const btnUnmute = document.getElementById("btn-unmute");

  btnMute?.addEventListener("click", () => {
    soundManager?.mute();
    btnMute.classList.add("hidden");
    btnUnmute.classList.remove("hidden");
  });

  btnUnmute?.addEventListener("click", () => {
    soundManager?.unmute();
    btnUnmute.classList.add("hidden");
    btnMute.classList.remove("hidden");
  });
}

/**
 * Displays an overlay prompting the user to rotate the device if in portrait mode.
 */
function checkOrientation() {
  const overlay = document.getElementById("rotate-device-overlay");
  if (!overlay) return;

  if (window.innerHeight > window.innerWidth) {
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
  }
}

/**
 * Determines if the device is in mobile landscape mode.
 * @returns {boolean} True if in landscape and screen is smaller than 1024px wide.
 */
function isMobileLandscape() {
  return window.innerWidth > window.innerHeight && window.innerWidth < 1224;
}

/**
 * Shows or hides mobile touch controls based on device orientation and size.
 */
function showMobileControlsIfLandscape() {
  const controls = document.getElementById("mobile-controls");
  if (!controls) return;

  if (isMobileLandscape()) {
    controls.classList.remove("hidden");
  } else {
    controls.classList.add("hidden");
  }
}

// Initialize control toggles and visibility on load
document.addEventListener("DOMContentLoaded", () => {
  togglePausePlay();
  toggleMuteUnmute();
  showMobileControlsIfLandscape();
});

// Re-evaluate control visibility on screen resize
window.addEventListener("resize", showMobileControlsIfLandscape);
