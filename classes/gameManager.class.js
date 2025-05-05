class GameManager {
    constructor(world) {
        this.world = world; //Referenz auf die Spielwelt
        this.isGameStopped = false;
        this.gameOverScreen = document.getElementById('game-over-screen');
    }

    gameOver() {
        //game over overlay
        console.log("Spiel ist vorbei")
        document.getElementById('game-over-screen').classList.remove('hidden');
        this.showGameOverScreen();
        this.stopGame();
    }

    showGameOverScreen() {
        if (this.gameOverScreen) {
            this.gameOverScreen.classList.remove('hidden');
        }
    }

    stopGame() {
        clearInterval(this.characterMovementInterval);
        clearInterval(this.charaterAnimationInterval);
        this.isGameStopped = true;
    }
}