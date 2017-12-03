import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'splash')
    this.splash.x = 0;
    this.splash.y = 0;
    this.splash.width = this.game.width;
    this.splash.height = this.game.height;
    this.splash.smoothed = false;

    this.load.setPreloadSprite(this.splash)
    //
    // load your assets
    //

    this.load.image('playercar', 'assets/images/player-base.png');
    this.load.spritesheet('pedo', 'assets/images/Pedestrian1.png', 9, 23);
    this.load.image('splatter', 'assets/images/splatter.png');
    this.load.image('car', 'assets/images/enemy1.png');
    this.load.image('level1', 'assets/images/level1.png');
    this.load.image('level2', 'assets/images/level2.png');
    this.load.image('level3', 'assets/images/level3.png');
    this.load.image('pw-nos', 'assets/images/Speed-NOS.png');
    this.load.image('hud-speedometer', 'assets/images/Speedometer.png');
    this.load.image('hud-speedpin', 'assets/images/speed-pin.png');
    this.load.image('hud-powerup', 'assets/images/Powerup-Display.png');
    this.load.image('hud-goreometer', 'assets/images/Gore-O-Meter.png');
    this.load.image('about-page', './assets/images/about-page.png');
    this.game.load.spritesheet('backBtn', './assets/images/back-btn.png', 63, 25);
  }

  create () {
    this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); } // disable right click menu on canvas

    this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'splash')
    this.splash.x = 0;
    this.splash.y = 0;
    this.splash.width = this.game.width;
    this.splash.height = this.game.height;
    this.splash.smoothed = false;

    this.playBtn = this.game.add.button(10 * 3, 188 * 3, 'playBtn', this.onPlayClick, this, 2, 1, 0);
    this.playBtn.width = 171;
    this.playBtn.height = 126;
    this.playBtn.smoothed = false;

    this.aboutBtn = this.game.add.button(242 * 3, 192 * 3, 'aboutBtn', this.onAboutClick, this, 2, 1, 0);
    this.aboutBtn.width = 204;
    this.aboutBtn.height = 99;
    this.aboutBtn.smoothed = false;
    
  }

  hover() {

  }

  onPlayClick() {
    this.state.start('Game')
  }

  onAboutClick() {
    this.state.start('About');
  }
}
