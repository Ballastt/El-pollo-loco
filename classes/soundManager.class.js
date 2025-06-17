/**
 * Manages all game sounds: loading, playing, pausing, stopping, muting, and volume.
 */
class SoundManager {
  /**
   * Creates a new SoundManager instance.
   * Initializes sound storage, mute state, and playback flags.
   */
  constructor() {
    /**
     * Stores all loaded sounds by key.
     * @type {Object.<string, HTMLAudioElement>}
     */
    this.sounds = {};

    /**
     * Indicates if all sounds are muted.
     * @type {boolean}
     */
    this.isMuted = JSON.parse(localStorage.getItem("isMuted")) || false;

    /**
     * Flags for currently playing sounds.
     * @type {Object.<string, boolean>}
     */
    this.playingFlags = {};
  }

  /**
   * Adds a new sound to the manager.
   * @param {string} key - Unique key for the sound.
   * @param {string} filePath - Path to the audio file.
   * @param {boolean} [loop=false] - Whether the sound should loop.
   * @param {number} [volume=1.0] - Volume (0.0 to 1.0).
   */
  addSound(key, filePath, loop = false, volume = 1.0) {
    const audio = new Audio(filePath);
    audio.loop = loop;
    audio.volume = volume;
    this.sounds[key] = audio;

    /**
     * Flags for looping sounds.
     * @type {Object.<string, boolean>}
     */
    if (!this.loopFlags) this.loopFlags = {};
    this.loopFlags[key] = loop;
  }

  /**
   * Plays a sound by key if allowed.
   * @param {string} key - The sound key.
   */
  play(key) {
    if (!this.isPlayable(key)) return;
    
    this.prepareSound(key);
    this.startPlayback(key);
  }

  /**
   * Checks if a sound can be played (exists, not muted, not already playing).
   * @param {string} key - The sound key.
   * @returns {boolean}
   */
  isPlayable(key) {
    const sound = this.sounds[key];

    if (!sound) return false;

    if (this.isMuted || this.playingFlags[key]) return false;

    return true;
  }

  /**
   * Prepares a sound for playback (resets time, sets loop, sets end handler).
   * @param {string} key - The sound key.
   */
  prepareSound(key) {
    const sound = this.sounds[key];
    this.playingFlags[key] = true;

    sound.currentTime = 0;
    sound.loop = this.loopFlags[key] ?? false;
    sound.onended = () => (this.playingFlags[key] = false);
  }

  /**
   * Starts playback of a sound, handling errors.
   * @param {string} key - The sound key.
   */
  startPlayback(key) {
    const sound = this.sounds[key];

    setTimeout(() => {
      sound.play().catch((err) => {
        this.playingFlags[key] = false;
      });
    }, 100);
  }

  /**
   * Pauses a specific sound.
   * @param {string} key - The sound key.
   */
  pause(key) {
    const sound = this.sounds[key];
    if (sound) {
      sound.pause();
      this.playingFlags[key] = false;
    }
  }

  /**
   * Stops a specific sound and resets its playback.
   * @param {string} key - The sound key.
   */
  stop(key) {
    const sound = this.sounds[key];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      this.playingFlags[key] = false;
    }
  }

  /**
   * Pauses all currently playing sounds.
   */
  pauseAll() {
    for (const key in this.sounds) {
      const sound = this.sounds[key];
      if (sound && !sound.paused) {
        sound.pause();
        this.playingFlags[key] = false;
      }
    }
  }

  /**
   * Resumes all looping sounds that were paused.
   */
  resumeAll() {
    for (const key in this.sounds) {
      const sound = this.sounds[key];
      const isLoop = this.loopFlags?.[key];

      if (sound && sound.paused && isLoop && !sound.ended) {
        try {
          sound.play();
        } catch (e) {
          console.warn(`[SoundManager] Fehler beim Fortsetzen von ${key}:`, e);
        }
      }
    }
  }

  /**
   * Stops all sounds and resets their playback.
   */
  stopAll() {
    for (const key in this.sounds) {
      const sound = this.sounds[key];
      try {
        sound.pause();
        sound.currentTime = 0;
        this.playingFlags[key] = false;
      } catch (e) {
        console.warn(`Error stopping sound for key: ${key}`, e);
      }
    }
  }

  /**
   * Sets the volume for a specific sound.
   * @param {string} key - The sound key.
   * @param {number} volume - Volume (0.0 to 1.0).
   */
  setVolume(key, volume) {
    const sound = this.sounds[key];
    if (sound) {
      sound.volume = volume;
    }
  }

  /**
   * Mutes all sounds and saves the state to localStorage.
   */
  mute() {
    this.isMuted = true;
    localStorage.setItem("isMuted", JSON.stringify(true));
    this.pauseAll();
  }

  /**
   * Unmutes all sounds and resumes looping sounds if user interacted.
   */
  unmute() {
    this.isMuted = false;
    localStorage.setItem("isMuted", JSON.stringify(false));

    if (userInteracted) {
      for (const key in this.sounds) {
        const sound = this.sounds[key];
        if (this.loopFlags[key] && sound.paused) {
          try {
            sound.play();
          } catch (err) {
            console.warn(`Loop resume failed for ${key}:`, err);
          }
        }
      }
    }
  }
}
