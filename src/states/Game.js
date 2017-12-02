/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/PlayerMcPlayerFace'
import Opponent from '../sprites/Opponent';
import PowerUp from '../sprites/PowerUp'
import HudObject from '../sprites/HudSpeedometer'
import HudSpeedPin from '../sprites/HudSpeedPin'
import Map from '../map/Map';
import Path from '../map/Path';
//import Hud from '../sprites/HudGroup';

export default class extends Phaser.State {

  init() { }
  preload() { }

  create() {
    //this.game.add.tileSprite(0, 0, 2048, 2048, 'level1');
    //this.game.world.setBounds(0, 0, 2048, 2048);
    //this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.physics.startSystem(Phaser.Physics.P2JS);
    this.physics.p2.setImpactEvents(true);
    this.physics.p2.restitution = 0.2;
      
    this.map = new Map(this.game);
    this.map.loadMap(1);
    this.path = new Path(this.game);
    this.powerUps = [];
      
    // TODO Set actual starting pos for player
    this.player = new Player({
      game: this.game,
      x: this.game.world.centerX,
      y: this.game.world.centerY,
      asset: 'playercar'
    });

    var playerCollisionGroup = this.physics.p2.createCollisionGroup();
    var opponentCollisionGroup = this.physics.p2.createCollisionGroup();
    var powerUpCollisionGroup = this.physics.p2.createCollisionGroup();

    this.physics.p2.updateBoundsCollisionGroup();

    this.physics.p2.enable(this.player, false);
    this.player.body.setCircle(32);
    this.player.body.setCollisionGroup(playerCollisionGroup);
    this.player.body.collides(opponentCollisionGroup, this.hitEnemy, this);
    this.player.body.collides(powerUpCollisionGroup);

    this.path.add(500, 100);
    this.path.add(500, 600);
    this.path.add(500, 1100);
    this.path.add(500, 1600);
    this.path.add(1000, 1600);
    this.path.add(1500, 1600);
    this.path.add(1500, 1100);
    this.path.add(1500, 600);

    this.createPowerUps(powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup);

    this.game.add.existing(this.player);
    this.createOpponents(this.path, powerUpCollisionGroup, opponentCollisionGroup);
      
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1); //Phaser.Camera.FOLLOW_TOPDOWN_TIGHT FOLLOW_LOCKON //, 300, 300
      
    this.createHud(this.player);
  }

  hitPlayerOrOpponent(body1, body2) {
    body2.sprite.alpha -= 0.05;
  }

  hitEnemy(body1, body2) {
    body2.sprite.alpha -= 0.20;
  }

  render() {
    this.map.render();
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }

  createOpponents(path, powerUpCollisionGroup, opponentCollisionGroup) {

    for (let i = 0; i < 4; i++) {
      let opponent = new Opponent(game, 100 + 100 * i, 100, 'car', path, powerUpCollisionGroup);
      opponent.body.setCollisionGroup(opponentCollisionGroup);
      opponent.body.collides([opponentCollisionGroup, powerUpCollisionGroup]);
      this.game.camera.follow(opponent, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1); //Phaser.Camera.FOLLOW_TOPDOWN_TIGHT FOLLOW_LOCKON //, 300, 300
    }
  }

  createPowerUps(powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup) {
    let pu = new PowerUp(this.game, this.game.world.centerX-200, this.game.world.centerY, 'pw-nos', 'nos', powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup)
    this.powerUps.push(pu);
  }

  createHud(carplayer) {
    var hud = this.game.add.group();
      
    this.hudPowerup = new HudObject({
      game: this.game,
      x: 960-(54*3),
      y: 0,
      asset: 'hud-powerup'
    });
      
    this.hudGoreometer = new HudObject({
      game: this.game,
      x: 960-(960-87*3),
      y: 720-(21*3),
      asset: 'hud-goreometer'
    });
      
    /* SPEEDOMETER low prio, not working right now
    this.hudSpeedometer = new HudObject({
      game: this.game,
      x: 0,
      y: 0,
      asset: 'hud-speedometer'
    });
      
    this.hudSpeedPin = new HudSpeedPin({
      game: this.game,
      x: 52,
      y: 50,
      asset: 'hud-speedpin'
    });
      
    //this.hudSpeedometer.fixedToCamera = true;
      
    hud.add(this.hudSpeedometer);
    hud.add(this.hudSpeedPin);
    */
      
    hud.add(this.hudPowerup);
    hud.add(this.hudGoreometer);
      
    this.game.add.existing(hud);
      
    hud.fixedToCamera = true;
      
    this.game.world.bringToTop(hud);
  }
}
