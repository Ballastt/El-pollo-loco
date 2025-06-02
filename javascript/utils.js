/**
 * DOM elements for the impressum and instructions dialogs.
 * @type {HTMLElement|null}
 */
const impressumBtn = document.getElementById("impressum-button");
const impressumDialog = document.getElementById("impressum-dialog");
const closeImpressumBtn = document.getElementById("close-impressum");
const impressumContent = document.querySelector(".impressum-content");

/**
 * Shows the game instructions overlay.
 * Sets display to flex and adds "active" class for animation.
 */
function showInstructions() {
  const overlay = document.getElementById("instructions-overlay");
  overlay.style.display = "flex";
  setTimeout(() => overlay.classList.add("active"), 10);
}

/**
 * Hides the game instructions overlay.
 * Removes "active" class and hides overlay after delay.
 */
function closeInstructions() {
  const overlay = document.getElementById("instructions-overlay");
  overlay.classList.remove("active");
  setTimeout(() => (overlay.style.display = "none"), 500);
}

/**
 * Closes the instructions overlay if the click happened outside the dialog.
 * @param {MouseEvent} event - The mouse click event.
 */
function closeInstructionsOnOutsideClick(event) {
  const instructionsDialog = document.querySelector(".instructions-dialog");
  if (instructionsDialog && !instructionsDialog.contains(event.target)) {
    closeInstructions();
  }
}

/**
 * Initializes the impressum dialog functionality:
 * - Opens dialog on impressum button click.
 * - Closes dialog on close button click.
 * - Closes dialog when clicking outside the dialog.
 */
function initializeImpressum() {
  if (impressumBtn && impressumDialog && closeImpressumBtn) {
    impressumBtn.addEventListener("click", () => {
      impressumDialog.style.display = "flex";
      setTimeout(() => impressumDialog.classList.add("active"), 10);
    });

    closeImpressumBtn.addEventListener("click", () => {
      closeImpressum();
    });
    closeImpressumOutsideClick();
  }
}

/**
 * Adds a global click listener to close the impressum dialog
 * when clicking outside the dialog or the impressum button.
 */
function closeImpressumOutsideClick() {
  document.addEventListener("click", function (event) {
    if (
      impressumDialog.classList.contains("active") &&
      !impressumContent.contains(event.target) &&
      !impressumBtn.contains(event.target)
    ) {
      closeImpressum();
    }
  });
}

/**
 * Closes the impressum dialog.
 * Removes the "active" class and hides the dialog after a short delay.
 */
function closeImpressum() {
  const overlay = document.getElementById("impressum-dialog");
  overlay.classList.remove("active");
  setTimeout(() => (overlay.style.display = "none"), 500);
}
