/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {

  init(levelNumber) {
      this.loadLevel = levelNumber || config.startLevel;
  }
  preload() {
    this.gameOver = this.add.sprite(0, 0, 'you-win');
    this.gameOver.width = config.gameWidth;
    this.gameOver.height = config.gameHeight;
    this.gameOver.smoothed = false;

    this.backBtn = this.game.add.button(5 * 3, 210 * 3, 'backBtn', this.onBackClick, this, 2, 1, 0);
    this.backBtn.width = 189;
    this.backBtn.height = 75;
    this.backBtn.smoothed = false;

    let x = 415;
    if(this.game.highScore < 10) {
      x = 435
    };

    this.score = this.game.add.text(x, 150, this.game.highScore, { font: "64px Courier New", fill: "#c31919", align: "center" });
    this.score.fontWeight = 900;
    this.score.fixedToCamera = true;
    this.game.world.bringToTop(this.score);

    if (this.loadLevel <= config.maxLevel) {
        this.playBtn = this.game.add.button(242 * 3, 192 * 3, 'playBtn', this.onPlayClick, this, 2, 1, 0);
        this.playBtn.width = 171;
        this.playBtn.height = 126;
        this.playBtn.smoothed = false;
    }

  }
  create() { }
  render() { }

  onBackClick() {
    this.state.start('Splash')
  }

  onPlayClick() {
    this.state.start('Game', true, false, Math.min(this.loadLevel, config.maxLevel));
  }

}
