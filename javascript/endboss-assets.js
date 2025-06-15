/**
 * Animation frame paths for the Endboss.
 * Each property contains an array of image paths for a specific animation state.
 * @typedef {Object} EndbossAssets
 * @property {string[]} WALKING - Image paths for the walking animation.
 * @property {string[]} ALERT - Image paths for the alert animation.
 * @property {string[]} ATTACK - Image paths for the attack animation.
 * @property {string[]} HURT - Image paths for the hurt animation.
 * @property {string[]} DEAD - Image paths for the dead animation.
 */

/**
 * Animation assets for the Endboss.
 * @type {EndbossAssets}
 */
const EndbossAssets = {
  WALKING: [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ],
  ALERT: [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ],
  ATTACK: [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ],
  HURT: [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ],
  DEAD: [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ],
};

/**
 * Enumeration of possible endboss states.
 * @readonly
 * @enum {string}
 */
const EndbossStates = {
  IDLE: "idle",
  WALKING: "walking",
  ALERT: "alert",
  ATTACK: "attack",
  HURT: "hurt",
  DEAD: "dead",
};

export { EndbossAssets, EndbossStates };
