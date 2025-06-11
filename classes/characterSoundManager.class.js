class CharacterSoundManager {
  constructor(character) {
    this.character = character;
  }

  /**
   * Plays or stops walking sound based on movement.
   */
  handleWalkingSound() {
    if (this.isMoving) {
      if (this.world.soundManager) this.world.soundManager.play("walkingSound");
    } else {
      if (this.world.soundManager) this.world.soundManager.stop("walkingSound");
    }
  }

  /**
   * Stops all character-related sounds.
   */
  stopAllSounds() {
    const sm = this.world?.soundManager;
    if (!sm) return;
    sm.stop("snoringPepe");
    sm.stop("walkingSound");
  }
  
  /**
   * Stops snoring sound and flag.
   */
  stopSnoring() {
    if (this.isSnoring) {
      this.world.soundManager.stop("snoringPepe");
      this.isSnoring = false;
    }
  }
}
