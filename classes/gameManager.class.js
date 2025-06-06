class GameManager {
  constructor(world) {
    this.world = world;
    this.soundManager = window.soundManager;
    this.isGameRunning = false;
    this.isPaused = false;
    this.gameOverScreen = document.getElementById("game-over-screen");
    this.startScreen = document.getElementById("start-screen");
    this.canvas = document.getElementById("canvas");
  }

  startGame() {
    initLevel();
    this.isGameRunning = true;
    this.isPaused = false;

    if (this.startScreen) this.startScreen.style.display = "none";
    if (this.gameOverScreen) this.gameOverScreen.classList.add("hidden");
    if (this.canvas) this.canvas.style.display = "block";

    

    // Hintergrund setzen
    this.world.setBackgroundObjects(level1.backgroundObjects);

    this.world?.run();
    this.soundManager?.play("backgroundMusic");
    console.log(this.soundManager, "background Music playing");
    console.log("[DEBUG] Versuche backgroundMusic zu spielen...");
    console.log("[DEBUG] Sound Keys:", Object.keys(soundManager.sounds));
    console.log("[DEBUG] soundManager:", soundManager);
    console.log(
      "[DEBUG] backgroundMusic existiert:",
      !!soundManager.sounds["backgroundMusic"]
    );
  }

  stopGame() {
    if (!this.isGameRunning) return;

    console.log("🛑 Spiel wird gestoppt...");
    this.isGameRunning = false;

    this.soundManager?.stopAll?.();
    clearInterval(this.world?.characterMovementInterval);
    clearInterval(this.world?.characterAnimationInterval);
    this.world?.stopObjects?.();
    this.world?.character?.stop?.();
    this.world?.endboss?.stop?.();
  }

  showEndScreen(won = false) {
    const screen = this.gameOverScreen;
    const textImg = document.getElementById("game-over-image");

    if (!screen || !textImg) {
      console.error("❌ Endbildschirm-Elemente fehlen!");
      return;
    }

    console.log("📺 Endscreen-Bild:", won ? "You Win" : "Game Over");

    textImg.src = won
      ? "img/You won, you lost/You Win A.png"
      : "img/You won, you lost/Game over A.png";

    screen.classList.remove("hidden");
    screen.style.zIndex = "1000";
    this.canvas.style.opacity = 0.2;

    setTimeout(() => {
      screen.classList.add("visible");
    }, 800);
  }

  gameOver() {
    if (!this.isGameRunning) return;
    console.log("💀 Spiel verloren");
    //this.stopGame(); // ZUERST alles stoppen
    setTimeout(() => {
      this.soundManager?.play("gameOver");
    }, 100);
    this.showEndScreen(false); // DANN den Endscreen zeigen
    this.soundManager.stopAll();
  }

  gameWon() {
    if (!this.isGameRunning) return;
    console.log("🏆 Spiel gewonnen");
    //this.stopGame(); // ZUERST alles stoppen
    setTimeout(() => {
      this.soundManager?.play("gameWon");
    }, 100); // 100 ms warten
    this.showEndScreen(true); // DANN den Endscreen zeigen
    this.soundManager.stopAll();
  }

  togglePause() {
    if (!this.isGameRunning) return;
    this.isPaused ? this.resumeGame() : this.pauseGame();
  }

  pauseGame() {
    if (!this.isGameRunning) return;
    console.log("⏸️ Spiel pausiert");
    this.isPaused = true;
    this.world?.pauseObjects?.();
    this.soundManager?.pauseAll?.();
  }

  resumeGame() {
    if (!this.isGameRunning) return;
    console.log("▶️ Spiel fortgesetzt");
    this.isPaused = false;
    this.world?.resumeObjects?.();
    this.soundManager?.resumeAll?.();
    console.log("[DEBUG] Versuche backgroundMusic zu spielen...");
    console.log("[DEBUG] Sound Keys:", Object.keys(soundManager.sounds));
    console.log("[DEBUG] soundManager:", soundManager);
    console.log(
      "[DEBUG] backgroundMusic existiert:",
      !!soundManager.sounds["backgroundMusic"]
    );
  }

  /**
   * Restarts the game by stopping the current game,
   * hiding the game over screen, resetting level and world,
   * and starting a new game session.
   */
  restartGame() {
    gameManager?.stopGame();
    hideGameOverScreen();
    if (canvas) canvas.style.opacity = 4;
    initLevel();
    world = new World(canvas, keyboard, level1);
    world.soundManager = soundManager;
    gameManager = new GameManager(world);
    world.gameManager = gameManager;
    gameManager.startGame();
  }
}
