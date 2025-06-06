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
    const sound = this.sounds[key];
    if (!sound) {
      console.warn(`No sound found for key: ${key}`);
      return;
    }
    if (this.isMuted) return;

    if (this.playingFlags[key]) {
      // Sound läuft schon, nicht nochmal starten
      return;
    }
    this.playingFlags[key] = true;

    sound.currentTime = 0; // auf Anfang setzen
    sound.loop = false;

    sound.onended = () => {
      console.log(`[SoundManager] sound ended for key: ${key}`);
      this.playingFlags[key] = false; // Flag zurücksetzen
    };

    sound.play().catch((err) => {
      console.warn(`[SoundManager] play failed for key: ${key}, err:`, err);
      this.playingFlags[key] = false;
    });
  }

  pause(key) {
    const sound = this.sounds[key];
    if (sound) {
      sound.pause();
    }
  }

  stop(key) {
    const sound = this.sounds[key];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  pauseAll() {
    console.log("[SoundManager] Pausiere alle Sounds...");
    this.pausedSounds = [];

    for (const key in this.sounds) {
      const sound = this.sounds[key];
      if (!sound.paused) {
        this.pause(key);
        this.pausedSounds.push(key);
        this.playingFlags[key] = false; // Wichtig: Flag zurücksetzen
        console.log(`[SoundManager] Sound pausiert: ${key}`);
      }
    }
  }

  resumeAll() {
    console.log("[SoundManager] Fortsetzen aller pausierten Sounds...");
    if (!this.pausedSounds) return;

    this.pausedSounds.forEach((key) => {
      console.log(`[SoundManager] Sound wird fortgesetzt: ${key}`);
      this.play(key);
    });
    this.pausedSounds = [];
  }

  stopAll() {
    for (const key in this.sounds) {
      this.stop(key);
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

    // Only play looped sounds *after* user interaction
    if (userInteracted) {
      for (const key in this.sounds) {
        const sound = this.sounds[key];
        if (sound.loop) {
          sound
            .play()
            .catch((err) => console.warn(`Playback blocked: ${err.message}`));
        }
      }
    }
  }
}
