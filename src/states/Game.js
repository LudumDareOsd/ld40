/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/PlayerMcPlayerFace'
import Opponent from '../sprites/Opponent';
import Pedo from '../sprites/Pedo';
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

    this.map = new Map(this.game, this);
    this.path = new Path(this.game);
    this.powerUps = [];
    this.killCount = 0;
    this.goreMeter = 0;

    // TODO Set actual starting pos for player
    this.player = new Player({
      game: this.game,
      x: this.game.world.centerX,
      y: this.game.world.centerY,
      asset: 'playercar',
      stateObj: this,
      map: this.map
    });

    var playerCollisionGroup = this.physics.p2.createCollisionGroup();
    var opponentCollisionGroup = this.physics.p2.createCollisionGroup();
    var powerUpCollisionGroup = this.physics.p2.createCollisionGroup();
    var pedoCollisionGroup = this.physics.p2.createCollisionGroup();

    this.physics.p2.updateBoundsCollisionGroup();
    this.physics.p2.enable(this.player, false);
    this.player.body.setCircle(32);
    this.player.body.setCollisionGroup(playerCollisionGroup);
    this.player.body.collides(opponentCollisionGroup, this.hitEnemy, this);
    this.player.body.collides(powerUpCollisionGroup);
    this.player.body.collides(pedoCollisionGroup, this.pedestrianHit, this);

    this.map.loadMap(1, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, pedoCollisionGroup);
    for (var i = 0; i < 50; i++) {
      var pedo = new Pedo(this.game, Math.floor(4096 * Math.random()), Math.floor(4096 * Math.random()), 'pedo', playerCollisionGroup, opponentCollisionGroup, pedoCollisionGroup);
      // var pedo = new Pedo(this.game, this.player.body.x, this.player.body.y, 'pedo', playerCollisionGroup, opponentCollisionGroup, pedoCollisionGroup);
    }
    this.game.add.existing(this.player);
    this.createHud(this.player);

    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1); //Phaser.Camera.FOLLOW_TOPDOWN_TIGHT FOLLOW_LOCKON //, 300, 300
    // this.map.editMap(1);
    this.createPowerUps(powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup);
  }

  hitPlayerOrOpponent(body1, body2) {
    //body2.sprite.alpha -= 0.05;
  }

  hitEnemy(body1, body2) {
    //body2.sprite.alpha -= 0.20;
  }

  render() {
    this.map.render();
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }

  createOpponents(path, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, pedoCollisionGroup, x, y, map) {
    let opponent = new Opponent(game, x, y, 'car', path, powerUpCollisionGroup, map);
    opponent.body.setCollisionGroup(opponentCollisionGroup);
    opponent.body.collides([opponentCollisionGroup, powerUpCollisionGroup, playerCollisionGroup, pedoCollisionGroup]);
  }

  createPowerUps(powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup) {
    /*
    var powsJson = {
        "Params": [{
            "PwoType": "nos",
            "Asset": "pw-nos",
            "X": 2040,
            "Y": 3308
          },{
            "PwoType": "nos",
            "Asset": "pw-nos",
            "X": this.game.world.centerX-100,
            "Y": this.game.world.centerY
          }
          ,{
            "PwoType": "nos",
            "Asset": "pw-nos",
            "X": this.game.world.centerX-300,
            "Y": this.game.world.centerY
          }
        ]
    }

    for (var i = 0, len = powsJson.Params.length; i < len; i++) {
      let pu = new PowerUp(this.game, powsJson.Params[i].X, powsJson.Params[i].Y, powsJson.Params[i].Asset, powsJson.Params[i].PwoType, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, this.player, this);
      this.powerUps.push(pu);
    }*/

    console.log('this world is '+this.game.world.width + ' '+this.game.world.height);

    this.nbrOfNosToCreate = this.game.rnd.integerInRange(3, 5);
    var nbrOfNosCreated = 0;
    var d = new Date();
    this.game.rnd.sow(d.getTime());

    do {
      var xPow = this.game.rnd.integerInRange(100, this.game.world.width);
      var yPow = this.game.rnd.integerInRange(100, this.game.world.height);
      var isOnRoad = this.map.isPointOnRoad(xPow, yPow);

      if (isOnRoad) {
        let pu = new PowerUp(this.game, xPow, yPow, 'pw-nos', 'nos', powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, this.player, this);
        this.powerUps.push(pu);
        nbrOfNosCreated += 1;
      }
    } while (nbrOfNosCreated < this.nbrOfNosToCreate);

    console.log('powerups created:'+this.powerUps.length);
  }

  renewRemovedPowerup(powType, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup) {

    console.log('renew pow'+powType);
    // How many of each Pow do we have?
    var nbrOfNos = this.powerUps.filter(a => a.type === 'nos').length;

    console.log('nbr of nos now:'+nbrOfNos+' should have:'+this.nbrOfNosToCreate);

    if(nbrOfNos < this.nbrOfNosToCreate) {
      console.log('adding nos');
      do {
        var xPow = this.game.rnd.integerInRange(200, this.game.world.width);
        var yPow = this.game.rnd.integerInRange(200, this.game.world.height);
        var isOnRoad = this.map.isPointOnRoad(xPow, yPow);

        if(isOnRoad) {
          let pu = new PowerUp(this.game, xPow, yPow, 'pw-nos', 'nos', powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, this.player, this);
          this.powerUps.push(pu);
        }
      } while (!isOnRoad);
    }
  }

  pedestrianHit() {
    this.killCount++;
    this.killCountText.text = this.killCount;

    if(this.goreMeter < 5) {
      this.goreMeter++;
      this.player.gore = 20 * this.goreMeter;
    }

    let cropRect = new Phaser.Rectangle(0, 0, (24 * this.goreMeter), this.hudGoreometerBar.height);
    this.hudGoreometerBar.crop(cropRect);
  }


  removePowerup(powType) {
    this.powerUps.splice(this.powerUps.indexOf(powType), 1);
    console.log('pow removed, now have:'+this.powerUps.length);
  }

  createHud(carplayer) {
    this.hud = this.game.add.group();

    this.hudPowerup = new HudObject({
      game: this.game,
      x: 960 - (54 * 3),
      y: 0,
      asset: 'hud-powerup',
      scale: 3
    });

    this.hudGoroMeter = new HudObject({
      game: this.game,
      x: 960 - (960 - 87 * 3),
      y: 720 - (21 * 3),
      asset: 'hud-goreometer',
      scale: 3
    });

    this.hudGoreometerBar = new HudObject({
      game: this.game,
      x: 960 - (867 - 87 * 3),
      y: 748 - (21 * 3),
      asset: 'hud-goreometer-bar',
      scale: 3
    });

    this.hudGoreometerBar.anchor.setTo(0, 0);

    let cropRect = new Phaser.Rectangle(0, 0, 0, this.hudGoreometerBar.height);
    this.hudGoreometerBar.crop(cropRect);

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

    this.hud.add(this.hudPowerup);
    this.hud.add(this.hudGoroMeter);
    this.hud.add(this.hudGoreometerBar);

    this.game.add.existing(this.hud);

    this.hud.fixedToCamera = true;

    this.game.world.bringToTop(this.hud);

    this.killCountText = this.game.add.text(10, 685, this.killCount, { font: "26px Arial", fill: "#ffffff", align: "center" });
    this.killCountText.fixedToCamera = true;
  }

  showPowOnHud(powType) {
    console.log('showing pow on hud:' + powType);
    if (powType == 'nos') {
      if (!this.hudPowNos) {
        this.hudPowNos = new HudObject({
          game: this.game,
          x: 960 - (92),
          y: 45,
          asset: 'pw-nos',
          scale: 3
        });
        this.hud.add(this.hudPowNos);
      }
    }
  }

  hidePow() {
    console.log('hide pow on hud');
    this.hudPowNos.kill();
    this.hudPowNos = null;
  }
}
