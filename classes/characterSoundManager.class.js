/**
 * Manages all sound-related behavior for the character.
 * Responsible for playing, stopping, and controlling character-related sounds such as walking or snoring.
 */
class CharacterSoundManager {
  /**
   * Creates an instance of CharacterSoundManager.
   * @param {Character} character - The character this sound manager is associated with.
   */
  constructor(character) {
    /** @type {Character} */
    this.character = character;
  }

  /**
   * Plays or stops the walking sound based on the character's movement state.
   * If the character is moving, the walking sound will play; otherwise, it stops.
   */
  handleWalkingSound() {
    const sm = this.character.world?.soundManager;
    if (!sm) return;
    if (this.character.isMoving) {
      sm.play("walkingSound");
      this.stopSnoring();
    } else {
      sm.stop("walkingSound");
    }
  }

  /**
   * Stops all sounds related to the character.
   * Currently stops snoring and walking sounds.
   */
  stopAllSounds() {
    const sm = this.character.world?.soundManager;
    if (!sm) return;
    sm.stop("snoringPepe");
    sm.stop("walkingSound");
  }

  /**
   * Stops the snoring sound and resets the snoring flag.
   * Only runs if the character is currently marked as snoring.
   */
  stopSnoring() {
    if (this.character.isSnoring) {
      const sm = this.character.world?.soundManager;
      if (sm) sm.stop("snoringPepe");
      this.character.isSnoring = false;
    }
  }
}
