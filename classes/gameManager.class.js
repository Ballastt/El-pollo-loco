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
    initLevel();

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
    const textImg = document.getElementById("game-over-image");

    if (!screen || !textImg) return console.error("Endbildschirm-Elemente fehlen!");
      
    textImg.src = won
      ? "img/You won, you lost/You Win A.png"
      : "img/You won, you lost/Game over A.png";
    screen.classList.remove("hidden");
    screen.style.zIndex = "1000";
    this.canvas.style.opacity = 0.2;

    // Verzögertes Einblenden (z. B. 800ms nach Game-Ende)
    setTimeout(() => {
      screen.classList.add("visible");
    }, 800);
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
    this.world.pauseObjects(); 
    if (this.soundManager) this.soundManager.pauseAll();
  }

  resumeGame() {
    console.log("Spiel wird fortgesetzt...");
    this.isPaused = false;
    this.world.resumeObjects();
    if (this.soundManager) this.soundManager.play();
  }

  stopGame() {
    console.log("Spiel wird gestoppt...");

    // Stoppe weltweite Loops (Canvas-Rendering, Bewegung etc.)
    clearInterval(this.world.characterMovementInterval);
    clearInterval(this.world.characterAnimationInterval);
    this.isGameRunning = false;

    if (this.soundManager) this.soundManager.stopAll();
    if (this.world && typeof this.world.stopObjects === "function")
      this.world.stopObjects();
  }

  gameOver() {
    console.log("Spiel ist vorbei");
    this.isGameRunning = false; 
    this.showEndScreen(false); 
    this.stopGame();
  }

  gameWon() {
    console.log("Spiel gewonnen!");
    this.isGameRunning = false;
    this.showEndScreen(true); 
    this.stopGame();
  }
}
