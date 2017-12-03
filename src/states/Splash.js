import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init() { }

  preload() {
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
    this.load.image('checkpoint', 'assets/images/checkpoint.png');
    this.load.image('splatter', 'assets/images/splatter.png');
    this.load.image('smoke', 'assets/images/smoke.png');
    this.load.image('car', 'assets/images/enemy1.png');
    this.load.image('level1', 'assets/images/level1.png');
    this.load.image('level2', 'assets/images/level2.png');
    this.load.image('level3', 'assets/images/level3.png');
    this.load.image('pw-nos', 'assets/images/Speed-NOS.png');
    this.load.image('pw-carwash', 'assets/images/Carwash.png');
    this.load.image('hud-speedometer', 'assets/images/Speedometer.png');
    this.load.image('hud-speedpin', 'assets/images/speed-pin.png');
    this.load.image('hud-powerup', 'assets/images/Powerup-Display.png');
    this.load.image('hud-goreometer', 'assets/images/Gore-O-Meter.png');
    this.load.image('hud-goreometer-bar', 'assets/images/gore-bar.png');
    this.load.image('about-page', './assets/images/about-page.png');
    this.load.image('about-page', './assets/images/about-page.png');
    this.load.spritesheet('game-over', './assets/images/game-over.png', 63, 25);
    
    this.game.load.audio('bgm', './assets/sound/Doom-Race.mp3');
    this.game.load.audio('engine', './assets/sound/engine.wav');
    this.load.audio('scream1', 'assets/sound/girly-scream.mp3');
    this.load.audio('scream2', 'assets/sound/screaaam.mp3');
    this.load.audio('scream3', 'assets/sound/Uaaah.mp3');
    this.load.audio('scream4', 'assets/sound/whooa.mp3');
  }

  create() {
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

    this.bgm = this.game.add.audio('bgm');
    this.game.sound.setDecodedCallback(this.bgm, this.playSound, this);
  }

  playSound() {
    if (!this.bgmStarted) {
      this.bgmStarted = true;
      this.bgm.loopFull(0.3);
    }
  } 

  hover() {

  }

  onPlayClick() {
    this.bgm.stop();
    this.bgmStarted = false;
    this.state.start('Game')
  }

  onAboutClick() {
    this.state.start('About');
  }
}
