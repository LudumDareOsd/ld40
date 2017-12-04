/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {

  init() { }
  preload() {
    this.gameOver = this.add.sprite(0, 0, 'you-win');
    this.gameOver.width = config.gameWidth;
    this.gameOver.height = config.gameHeight;
    this.gameOver.smoothed = false;

    this.backBtn = this.game.add.button(5 * 3, 210 * 3, 'backBtn', this.onBackClick, this, 2, 1, 0);
    this.backBtn.width = 189;
    this.backBtn.height = 75;
    this.backBtn.smoothed = false;
  }
  create() { }
  render() { }

  onBackClick() {
    this.state.start('Splash')
  }

}
