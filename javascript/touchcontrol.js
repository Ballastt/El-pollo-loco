/**
 * Sets up touch controls for mobile devices.
 * Maps directional and action buttons to the `keyboard` object to simulate key presses.
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
 * Detects the device type based on touch support and screen width.
 * @returns {"desktop" | "mobile" | "tablet" | "hybrid"} A string indicating the device type.
 */
function detectDeviceType() {
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (!hasTouch) return "desktop";

  const width = window.innerWidth;

  if (width <= 767) return "mobile";
  if (width <= 1366) return "tablet";

  return "hybrid";
}

/**
 * Adds event listeners to pause and resume the game via UI buttons.
 * Toggles visibility between the pause and play buttons accordingly.
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
 * Adds event listeners to mute and unmute all sounds using the UI.
 * Updates the visible button depending on the mute state.
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
 * Displays or hides an overlay prompting the user to rotate their device
 * if it's in portrait mode on mobile.
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
 * Checks if the current device is in landscape mode and narrow enough to be considered mobile.
 * @returns {boolean} True if device is in landscape mode on a small screen.
 */
function isMobileLandscape() {
  return window.innerWidth > window.innerHeight && window.innerWidth < 1024;
}

/**
 * Shows or hides the on-screen mobile controls depending on device type and orientation.
 */
function showMobileControlsIfLandscape() {
  const controls = document.getElementById("mobile-controls");
  if (!controls) return;

  const type = detectDeviceType();
  const isLandscape = window.innerWidth > window.innerHeight;

  if (
    (type === "mobile" || type === "tablet" || type === "hybrid") &&
    isLandscape
  ) {
    controls.classList.remove("hidden");
  } else {
    controls.classList.add("hidden");
  }
}

/**
 * Prevents context menu only on mobile touch buttons.
 * Prevents long-press context menus from interrupting gameplay on touch devices.
 */
function preventContextMenuOnTouchButtons() {
  const buttonIds = [
    "btn-left",
    "btn-right",
    "btn-jump",
    "btn-throw",
    "btn-pause",
    "btn-play",
    "btn-mute",
    "btn-unmute",
  ];

  buttonIds.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("contextmenu", (e) => e.preventDefault());
    }
  });
}

/**
 * Initializes UI toggle behavior and shows/hides elements based on device layout.
 * Called when the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  togglePausePlay();
  toggleMuteUnmute();
  showMobileControlsIfLandscape();
  preventContextMenuOnTouchButtons();
});

/**
 * Re-checks and updates visibility of mobile controls on screen size or orientation change.
 */
window.addEventListener("resize", showMobileControlsIfLandscape);
window.addEventListener("orientationchange", showMobileControlsIfLandscape);
