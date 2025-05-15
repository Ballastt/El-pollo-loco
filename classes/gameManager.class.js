class GameManager {
  constructor(world) {
    this.world = world; // Referenz auf die Spielwelt
    this.isGameRunning = false; // Standard: Spiel läuft nicht
    this.isPaused = false;
    this.gameOverScreen = document.getElementById("game-over-screen");
    this.startScreen = document.getElementById("start-screen");
    this.canvas = document.getElementById("canvas");
  }

  startGame() {
    console.log("Spiel wird gestartet...");

    //Level Initialisieren
    if (!level1) {
      initLevel();
      console.log("Level 1 initialisiert,", level1);
    }

    this.isGameRunning = true; // Spielzustand auf "gestartet" setzen
    this.isPaused = false;

    if (this.startScreen) this.startScreen.style.display = "none";
    if (this.gameOverScreen) this.gameOverScreen.classList.add("hidden");

    if (this.canvas) this.canvas.style.display = "block";

    // Initialisiere das Spiel
    if (this.world) {
      this.world.run();
    } else {
      console.error("World wird nicht richtig initialisiert!");
    }
  }

  /*pauseGame() {
    console.log("Spiel wird angehalten...");
    this.isPaused = !this.isPaused;
      if (this.isPaused) {
        console.log("Spiel ist angehalten");
      } else {
        console.log("Spiel läuft weiter");
        this.world.run();
      }
  }*/
  
  stopGame() {
    console.log("Spiel wird gestoppt...");
    clearInterval(this.world.characterMovementInterval);
    clearInterval(this.world.characterAnimationInterval);
    this.isGameRunning = false; // Spielzustand auf "gestoppt" setzen
  }

  gameOver() {
    console.log("Spiel ist vorbei");

    this.isGameRunning = false; // Spielstatus setzen
    if (this.gameOverScreen) {
      console.log("Game Over Screen wird angezeigt");
      this.gameOverScreen.classList.remove("hidden");
    } else {
      console.error("Kein Game Over Screen gefunden!");
    }
    this.stopGame();
  }
}
