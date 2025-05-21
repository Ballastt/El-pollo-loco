// Funktion, um Spielanweisungen zu zeigen
function showInstructions() {
  const overlay = document.getElementById("instructions-overlay");
  overlay.style.display = "flex";
  setTimeout(() => overlay.classList.add("active"), 10);
}

function closeInstructions() {
  const overlay = document.getElementById("instructions-overlay");
  overlay.classList.remove("active");
  setTimeout(() => (overlay.style.display = "none"), 500); 
}

function closeInstructionsOnOutsideClick(event) {
  const instructionsDialog = document.querySelector(".instructions-dialog");
  if (instructionsDialog && !instructionsDialog.contains(event.target)) {
    closeInstructions();
  }
}

function initializeImpressum() {
  const impressumBtn = document.getElementById("impressum-button");
  const impressumDialog = document.getElementById("impressum-dialog");
  const closeImpressumBtn = document.getElementById("close-impressum");

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

function closeImpressumOutsideClick() {
  const impressumDialog = document.getElementById("impressum-dialog");
  const impressumContent = document.querySelector(".impressum-content");
  const impressumBtn = document.getElementById("impressum-button");
  
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

function closeImpressum() {
  const overlay = document.getElementById("impressum-dialog");
  overlay.classList.remove("active");
  setTimeout(() => (overlay.style.display = "none"), 500);
}