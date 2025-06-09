document
  .getElementById("btn-left")
  .addEventListener("touchstart", () => (keyboard.LEFT = true));
document
  .getElementById("btn-left")
  .addEventListener("touchend", () => (keyboard.LEFT = false));

document
  .getElementById("btn-right")
  .addEventListener("touchstart", () => (keyboard.RIGHT = true));
document
  .getElementById("btn-right")
  .addEventListener("touchend", () => (keyboard.RIGHT = false));

document
  .getElementById("btn-jump")
  .addEventListener("touchstart", () => (keyboard.UP = true));
document
  .getElementById("btn-jump")
  .addEventListener("touchend", () => (keyboard.UP = false));

document
  .getElementById("btn-throw")
  .addEventListener("touchstart", () => (keyboard.SPACE = true));
document
  .getElementById("btn-throw")
  .addEventListener("touchend", () => (keyboard.SPACE = false));

document
  .getElementById("btn-pause")
  .addEventListener("click", () => gameManager.togglePause());
document
  .getElementById("btn-mute")
  .addEventListener("click", () => soundManager?.mute());

/**
 * Checks device orientation and shows an overlay if in portrait mode.
 */
function checkOrientation() {
  const overlay = document.getElementById("rotate-device-overlay");
  if (!overlay) return;
  overlay.style.display =
    window.innerHeight > window.innerWidth ? "flex" : "none";
}

function isMobileLandscape() {
  return window.innerWidth > window.innerHeight && window.innerWidth < 1024;
}

function showMobileControlsIfLandscape() {
  const controls = document.getElementById("mobile-controls");
  if (!controls) return;

  if (isMobileLandscape()) {
    controls.classList.remove("hidden");
  } else {
    controls.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", showMobileControlsIfLandscape);
window.addEventListener("resize", showMobileControlsIfLandscape);
