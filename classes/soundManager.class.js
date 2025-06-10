class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = JSON.parse(localStorage.getItem("isMuted")) || false;
    this.playingFlags = {};
  }

  addSound(key, filePath, loop = false, volume = 1.0) {
    const audio = new Audio(filePath);
    audio.loop = loop;
    audio.volume = volume;
    this.sounds[key] = audio;

    if (!this.loopFlags) this.loopFlags = {};
    this.loopFlags[key] = loop;
  }

  play(key) {
    if (!this.isPlayable(key)) {
      return;
    }

    this.prepareSound(key);
    this.startPlayback(key);
  }

  isPlayable(key) {
    const sound = this.sounds[key];
    if (!sound) {
      console.warn(`No sound found for key: ${key}`);
      return false;
    }

    if (this.isMuted || this.playingFlags[key]) return false;

    return true;
  }

  prepareSound(key) {
    const sound = this.sounds[key];
    this.playingFlags[key] = true;

    sound.currentTime = 0;
    sound.loop = false;
    sound.onended = () => (this.playingFlags[key] = false);
  }

  startPlayback(key) {
    const sound = this.sounds[key];

    setTimeout(() => {
      sound.play().catch((err) => {
        console.warn(`[SoundManager] play failed for key: ${key}, err:`, err);
        this.playingFlags[key] = false;
      });
    }, 100);
  }

  pause(key) {
    const sound = this.sounds[key];
    if (sound) {
      sound.pause();
      this.playingFlags[key] = false;
    }
  }

  stop(key) {
    const sound = this.sounds[key];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      this.playingFlags[key] = false; // 🔧 Wichtig: Rücksetzen des Flags!
    }
  }

  pauseAll() {
    for (const key in this.sounds) {
      const sound = this.sounds[key];
      if (sound && !sound.paused) {
        sound.pause();
        this.playingFlags[key] = false; // 🔧 Important!
      }
    }
  }

  resumeAll() {
    for (const key in this.sounds) {
      const sound = this.sounds[key];
      const isLoop = this.loopFlags?.[key]; // <- prüfe ob Sound ein Loop ist

      if (sound && sound.paused && isLoop && !sound.ended) {
        try {
          sound.play();
        } catch (e) {
          console.warn(`[SoundManager] Fehler beim Fortsetzen von ${key}:`, e);
        }
      }
    }
  }

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

  setVolume(key, volume) {
    const sound = this.sounds[key];
    if (sound) {
      sound.volume = volume;
    }
  }

  mute() {
    this.isMuted = true;
    localStorage.setItem("isMuted", JSON.stringify(true));
    this.pauseAll();
  }

  unmute() {
    this.isMuted = false;
    localStorage.setItem("isMuted", JSON.stringify(false));

    // Resume looping sounds immediately if needed
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
