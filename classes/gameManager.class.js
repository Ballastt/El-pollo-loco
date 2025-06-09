class GameManager {
  constructor(world) {
    this.world = world;
    this.soundManager = soundManager;
    this.isGameRunning = false;
    this.isPaused = false;
    this.isGameOver = false;
    this.gameOverScreen = document.getElementById("game-over-screen");
    this.startScreen = document.getElementById("start-screen");
    this.canvas = document.getElementById("canvas");
  }

  startGame() {
    this.isGameRunning = true;
    this.isPaused = false;

    if (this.startScreen) this.startScreen.style.display = "none";
    if (this.gameOverScreen) this.gameOverScreen.classList.add("hidden");
    if (this.canvas) this.canvas.style.display = "block";

    this.world.setBackgroundObjects(level1.backgroundObjects);

    this.world?.run();
    this.soundManager?.play("backgroundMusic");
  }

  stopGame() {
    if (!this.isGameRunning) return;

    console.log("🛑 Spiel wird gestoppt...");
    this.isGameRunning = false;

    this.soundManager?.stopAll?.();
    clearInterval(this.world?.characterMovementInterval);
    clearInterval(this.world?.characterAnimationInterval);
    window.removeEventListener("keydown", handleKeyDown);

    this.world?.stopObjects?.();
    this.world?.character?.stop?.();
    this.world?.endboss?.stop?.();
    this.world?.stopGameLoop?.();
  }

  showEndScreen(won = false) {
    const screen = this.gameOverScreen;
    const textImg = document.getElementById("game-over-image");

    if (!screen || !textImg)
      return console.error("❌ Endbildschirm-Elemente fehlen!");

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
    console.log("💀 Spiel verloren");
    this.isGameRunning = false;
    this.isGameOver = true;
    this.world?.stopGameLoop?.();

    setTimeout(() => {
      this.soundManager?.play("gameOver");
    }, 100);
    this.showEndScreen(false); // DANN den Endscreen zeigen
    this.soundManager?.stopAll();
  }

  gameWon() {
    console.log("🏆 Spiel gewonnen");
    this.isGameRunning = false;
    this.world?.stopGameLoop?.();

    setTimeout(() => {
      this.soundManager?.play("gameWon");
    }, 50); // 100 ms warten
    this.showEndScreen(true); // DANN den Endscreen zeigen
    this.soundManager?.stopAll();
  }

  togglePause() {
    if (!this.isGameRunning) return;
    this.isPaused ? this.resumeGame() : this.pauseGame();
  }

  pauseGame() {
    if (!this.isGameRunning) return;

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
  }

  restartGame() {
    console.log("Enemies nach Restart:", world.level.enemies);
    console.log("🚨 RestartGame gestartet — aktuelle World:", this.world);

    this.pauseAndResetState();
    this.clearWorld();
    this.startNewGame();
  }

  pauseAndResetState() {
    this.soundManager?.stopAll();
    gameManager?.stopGame();
    keyboard.reset();
  }

  clearWorld() {
    if (world) {
      this.world.stopGameLoop();
      world = null;
    }
    hideGameOverScreen();
    canvas.style.opacity = 1;
  }

  startNewGame() {
    initLevel();
    world = new World(canvas, keyboard, level1);
    world.soundManager = soundManager;

    gameManager = new GameManager(world);
    world.gameManager = gameManager;

    gameManager.startGame();
  }
}
