class GameManager {
  constructor(world) {
    this.world = world; // Referenz auf die Spielwelt
    this.soundManager = window.soundManager;
    this.isGameRunning = false; // Standard: Spiel läuft nicht
    this.isPaused = false;
    this.gameOverScreen = document.getElementById("game-over-screen");
    this.startScreen = document.getElementById("start-screen");
    this.canvas = document.getElementById("canvas");
  }

  startGame() {
    if (!level1) initLevel();

    this.isGameRunning = true; // Spielzustand auf "gestartet" setzen
    this.isPaused = false;

    if (this.startScreen) this.startScreen.style.display = "none";
    if (this.gameOverScreen) this.gameOverScreen.classList.add("hidden");
    if (this.canvas) this.canvas.style.display = "block";

    // Initialisiere das Spiel
    if (this.world) this.world.run();
    if (this.soundManager) this.soundManager.play("backgroundMusic");
  }

  showEndScreen(won = false) {
    const screen = this.gameOverScreen;
    const img = document.getElementById("game-over-image");

    if (!screen || !img) {
      console.error("Endbildschirm-Elemente fehlen!");
      return;
    }

    img.src = won
      ? "img/You won, you lost/You Win A.png"
      : "img/You won, you lost/Game over A.png";
    screen.classList.remove("hidden");
    this.canvas.style.opacity = 0.2;
  }

  togglePause() {
    if (this.isPaused) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }
  }

  pauseGame() {
    console.log("Spiel wird pausiert...");
    this.isPaused = true;
    this.world.pauseObjects(); // Alle Objekte pausieren
    if (this.soundManager) this.soundManager.pauseAll();
  }

  resumeGame() {
    console.log("Spiel wird fortgesetzt...");
    this.isPaused = false;
    this.world.resumeObjects(); // Alle Objekte fortsetzen
    if (this.soundManager) this.soundManager.play();
  }

  stopGame() {
    console.log("Spiel wird gestoppt...");

    // Stoppe weltweite Loops (Canvas-Rendering, Bewegung etc.)
    clearInterval(this.world.characterMovementInterval);
    clearInterval(this.world.characterAnimationInterval);
    this.isGameRunning = false;

    // Alle Soundquellen stoppen
    if (this.soundManager) this.soundManager.stopAll();

    // ❗ Alle Spielobjekte stoppen
    if (this.world && typeof this.world.stopObjects === "function") this.world.stopObjects();
  }

  gameOver() {
    console.log("Spiel ist vorbei");
    this.isGameRunning = false; // Spielstatus setzen
    this.showEndScreen(false); //Niederlage anzeigen
    this.stopGame();
  }

  gameWon() {
    console.log("Spiel gewonnen!");
    this.isGameRunning = false;
    this.showEndScreen(true); // Sieg anzeigen
    this.stopGame();
  }
}
