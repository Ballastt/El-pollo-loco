/**
 * Class to track the state of keyboard keys.
 */
class Keyboard {
  /**
   * Creates an instance of Keyboard.
   * Initializes key states for common control keys.
   */
  constructor() {
    /** @type {boolean[]} Array to store currently pressed keys */
    this.keys = [];

    /** @type {boolean} Whether the LEFT arrow key is pressed */
    this.LEFT = false;

    /** @type {boolean} Whether the RIGHT arrow key is pressed */
    this.RIGHT = false;

    /** @type {boolean} Whether the UP arrow key is pressed */
    this.UP = false;

    /** @type {boolean} Whether the DOWN arrow key is pressed */
    this.DOWN = false;

    /** @type {boolean} Whether the SPACE key is pressed */
    this.SPACE = false;

    /** @type {boolean} Whether the "D" key is pressed */
    this.D = false;
  }

  reset() {
    keyboard.SPACE = false;
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.D = false;
  }
}
