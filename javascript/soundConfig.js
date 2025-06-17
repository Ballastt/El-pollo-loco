/**
 * @typedef {Object} SoundConfigItem
 * @property {string} name - Unique identifier for the sound.
 * @property {string} src - Path to the audio file.
 * @property {boolean} loop - Whether the sound should loop when played.
 * @property {number} volume - Initial volume level (0.0 to 1.0).
 */

/**
 * Configuration for all game sounds used by the SoundManager.
 * Each entry defines the metadata needed to load and control an audio track.
 * 
 * @type {SoundConfigItem[]}
 */
const soundConfig = [
  { name: "backgroundMusic", src: "audio/audio_start_screen.mp3", loop: true, volume: 0.2 },
  { name: "normalChickenWalking", src: "audio/normal_chicken_walking.mp3", loop: true, volume: 0.4 },
  { name: "chickenDeath", src: "audio/dying_chicken.mp3", loop: false, volume: 0.8 },
  { name: "smallChickenWalking", src: "audio/small_chicken_walking.mp3", loop: false, volume: 0.8 },
  { name: "coinCollect", src: "audio/get_coin.mp3", loop: false, volume: 0.5 },
  { name: "bottleCollect", src: "audio/get_bottle.mp3", loop: false, volume: 0.5 },
  { name: "walkingSound", src: "audio/character_walk_on_sand.mp3", loop: true, volume: 1.0 },
  { name: "jumpSound", src: "audio/character_jumping.mp3", loop: false, volume: 0.8 },
  { name: "hurtSound", src: "audio/pepe_hurting.mp3", loop: false, volume: 0.8 },
  { name: "snoringPepe", src: "audio/pepe_snoring.mp3", loop: false, volume: 0.7 },
  { name: "PepeDying", src: "audio/pepe_dying.mp3", loop: false, volume: 0.6 },
  { name: "introEndboss", src: "audio/endboss_intro_sound.mp3", loop: false, volume: 1.0 },
  { name: "endbossClucking", src: "audio/endboss_clucking.mp3", loop: false, volume: 0.6 },
  { name: "endbossAngry", src: "audio/endboss_angry.mp3", loop: false, volume: 0.8 },
  { name: "endbossHurt", src: "audio/endboss_hurting.mp3", loop: false, volume: 0.7 },
  { name: "endbossDying", src: "audio/endboss_dying.mp3", loop: false, volume: 0.6 },
  { name: "bottleSplash", src: "audio/bottle_splash.mp3", loop: false, volume: 0.4 },
  { name: "gameWon", src: "audio/game_won.mp3", loop: false, volume: 0.9 },
  { name: "gameOver", src: "audio/game_over.mp3", loop: false, volume: 0.8 },
];
