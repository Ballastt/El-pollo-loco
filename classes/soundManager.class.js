class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = JSON.parse(localStorage.getItem("isMuted")) || false;
  }

  addSound(key, filePath, loop = false, volume = 1.0) {
    const audio = new Audio(filePath);
    audio.loop = loop;
    audio.volume = volume;
    this.sounds[key] = audio;
  }

  play(key) {
    const sound = this.sounds[key];
    if (!sound) {
      console.warn(`No sound found for key: ${key}`);
      return;
    }

    if (!this.isMuted) {
      sound.play();
    }
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
    for (const key in this.sounds) {
      this.pause(key);
    }
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
