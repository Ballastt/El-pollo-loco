class GameManager {
  constructor(world) {
    this.world = world; // Referenz auf die Spielwelt
    this.gameOverScreen = document.getElementById("game-over-screen");
    this.startScreen = document.getElementById("start-screen");
    this.canvas = document.getElementById("canvas");
    this.isGameRunning = false;
  }

  startGame() {
    console.log("Spiel wird gestartet...");
    // Verstecke den Startbildschirm
    if (this.startScreen) {
      this.startScreen.style.display = "none";
    }

    // Verstecke den Game-Over-Screen
    if (this.gameOverScreen) {
      this.gameOverScreen.classList.add("hidden");
    }

    // Zeige das Canvas an
    if (this.canvas) {
      this.canvas.style.display = "block";
    }

    // Initialisiere das Spiel
    this.initGame();
  }

  initGame() {
    this.world.canvas = this.canvas;
    this.world.level = level1;
    this.world.level.regenerateEnemies(); // Gegner neu generieren

    this.world.keyboard = keyboard; // Übergabe der Tastatur
    console.log("Spiel erfolgreich initialisiert");
    console.log("my character is", this.world.character);
  }

  gameOver() {
    console.log("Spiel ist vorbei");
    if (this.gameOverScreen) {
      this.gameOverScreen.classList.remove("hidden");
    }
    this.isGameRunning = true;
    this.stopGame();
  }

  stopGame() {
    clearInterval(this.world.characterMovementInterval);
    clearInterval(this.world.characterAnimationInterval);
    this.isGameRunning = true;
  }
}
