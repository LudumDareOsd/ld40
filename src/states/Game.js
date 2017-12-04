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

  init(levelNumber) {
    this.nbrOfNosToCreate = 5;
    this.nbrOfCarWashToCreate = 3;
    this.loadLevel = levelNumber || 1;
  }
  preload() { }

  create() {
    this.physics.startSystem(Phaser.Physics.P2JS);
    this.physics.p2.setImpactEvents(true);
    this.physics.p2.restitution = 0.2;

    this.game.started = false;

    this.loadAudio();

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
      asset: 'player-all',
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

    this.map.loadMap(this.loadLevel, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, pedoCollisionGroup);
    for (var i = 0; i < 50; i++) {
      var pedo = new Pedo(this.game, Math.floor(4096 * Math.random()), Math.floor(4096 * Math.random()), 'pedo', playerCollisionGroup, opponentCollisionGroup, pedoCollisionGroup, this.map);
    }
    this.game.add.existing(this.player);
    this.createHud(this.player);

    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1); //Phaser.Camera.FOLLOW_TOPDOWN_TIGHT FOLLOW_LOCKON //, 300, 300
    this.createPowerUps(powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup);

    this.powerUpCollisionGroup = powerUpCollisionGroup;
    this.opponentCollisionGroup = opponentCollisionGroup;
    this.playerCollisionGroup = playerCollisionGroup;

    this.game.time.events.repeat(Phaser.Timer.SECOND * 10, 50, this.renewRemovedPowerup2, this);

    this.startCountDown();
  }

  hitPlayerOrOpponent(body1, body2) {
    //body2.sprite.alpha -= 0.05;
  }

  hitEnemy(body1, body2) {
    //body2.sprite.alpha -= 0.20;
  }

  render() {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }

  createOpponents(path, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, pedoCollisionGroup, x, y, map, angle) {
    let opponent = new Opponent(game, x, y, 'car', path, powerUpCollisionGroup, map, angle);
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

    this.totalNbrOfPowerUpsToCreate = this.nbrOfNosToCreate + this.nbrOfCarWashToCreate;
    /*var nbrOfNosCreated = 0;
    var nbrOfCarWashCreated = 0;*/
    var nbrOfNosCreated = this.powerUps.filter(a => a.type === 'nos').length;
    var nbrOfCarWashCreated = this.powerUps.filter(a => a.type === 'carwash').length;
    var nbrOfPowerUpsCreated = nbrOfNosCreated + nbrOfCarWashCreated;

    //var d = new Date();
    //this.game.rnd.sow(d.getTime());

    console.log('tot pows to create:' + this.totalNbrOfPowerUpsToCreate + ' got nos:' + nbrOfNosCreated + ' carwash:' + nbrOfCarWashCreated);

    /*do {
      var xPow = this.game.rnd.integerInRange(100, this.game.world.width);
      var yPow = this.game.rnd.integerInRange(100, this.game.world.height);
      var isOnRoad = this.map.isPointOnRoad(xPow, yPow);

      if (isOnRoad) {
        if(nbrOfNosCreated < this.nbrOfNosToCreate) {
          let pu1 = new PowerUp(this.game, xPow, yPow, 'pw-nos', 'nos', powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, this.player, this);
          this.powerUps.push(pu1);
          nbrOfNosCreated += 1;
          console.log('created pow nos');
        } else if(nbrOfCarWashCreated < this.nbrOfCarWashToCreate) {
          let pu2 = new PowerUp(this.game, xPow, yPow, 'pw-carwash', 'carwash', powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, this.player, this);
          this.powerUps.push(pu2);
          nbrOfCarWashCreated += 1;
          console.log('created pow carwash');
        }

        nbrOfPowerUpsCreated = nbrOfNosCreated + nbrOfCarWashCreated;
      }
    } while (nbrOfPowerUpsCreated < this.totalNbrOfPowerUpsToCreate);*/
    while (nbrOfPowerUpsCreated < this.totalNbrOfPowerUpsToCreate) {
      var xPow = this.game.rnd.integerInRange(100, this.game.world.width);
      var yPow = this.game.rnd.integerInRange(100, this.game.world.height);
      var isOnRoad = this.map.isPointOnRoad(xPow, yPow);

      if (isOnRoad) {
        if (nbrOfNosCreated < this.nbrOfNosToCreate) {
          let pu1 = new PowerUp(this.game, xPow, yPow, 'pw-nos', 'nos', powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, this.player, this);
          this.powerUps.push(pu1);
          nbrOfNosCreated += 1;
          console.log('created pow nos');
        } else if (nbrOfCarWashCreated < this.nbrOfCarWashToCreate) {
          let pu2 = new PowerUp(this.game, xPow, yPow, 'pw-carwash', 'carwash', powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, this.player, this);
          this.powerUps.push(pu2);
          nbrOfCarWashCreated += 1;
          console.log('created pow carwash');
        }

        nbrOfPowerUpsCreated = nbrOfNosCreated + nbrOfCarWashCreated;
      }
    }

    console.log('powerups created:' + this.powerUps.length);
  }

  renewRemovedPowerup(powType, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup) {

    console.log('renew pow:' + powType);

    this.createPowerUps(powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup);
    /*
        var nbrOfNos = this.powerUps.filter(a => a.type === 'nos').length;
        var nbrOfCarwash = this.powerUps.filter(a => a.type === 'carwash').length;
        var nbrOfTotalPow = nbrOfNos + nbrOfCarwash;

        console.log('nbr of pow now nos:'+nbrOfNos+' should have:'+this.nbrOfNosToCreate + ' carwash:'+ nbrOfCarwash + ' should have:'+this.nbrOfCarWashToCreate);

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
        */
  }

  renewRemovedPowerup2() {
    console.log('renew pow');

    this.createPowerUps(this.powerUpCollisionGroup, this.opponentCollisionGroup, this.playerCollisionGroup);
  }

  pedestrianHit() {
    this.killCount++;
    this.killCountText.text = this.killCount;

    if (this.goreMeter < 5) {
      this.goreMeter++;
      this.player.gore = 20 * this.goreMeter;
    }

    let cropRect = new Phaser.Rectangle(0, 0, (24 * this.goreMeter), this.hudGoreometerBar.height);
    this.hudGoreometerBar.crop(cropRect);

    let rnd = this.game.rnd.integerInRange(1, 4);

    switch (rnd) {
      case 1: this.scream1.play();
        break;
      case 2: this.scream2.play();
        break;
      case 3: this.scream3.play();
        break;
      case 4: this.scream4.play();
        break;
    }
  }

  powCarWashUse() {
    
    this.goreMeter = 0;
    let cropRect = new Phaser.Rectangle(0, 0, (24 * this.goreMeter), this.hudGoreometerBar.height);
    this.hudGoreometerBar.crop(cropRect);
  }


  removePowerup(powType) {
    this.powerUps.splice(this.powerUps.indexOf(powType), 1);
    console.log('pow removed, now have:' + this.powerUps.length);
  }

  createHud(carplayer) {
    this.hud = this.game.add.group();

    this.hudSpeedometer = new HudObject({
      game: this.game,
      x: 0,
      y: 0,
      asset: 'hud-speedometer',
      scale: 3
    });

    this.hudSpeedometer.smoothed = false;

    this.hudPowerup = new HudObject({
      game: this.game,
      x: 960 - (54 * 3),
      y: 0,
      asset: 'hud-powerup',
      scale: 3
    });

    this.hudPowerup.smoothed = false;

    this.hudGoroMeter = new HudObject({
      game: this.game,
      x: 960 - (960 - 87 * 3),
      y: 720 - (21 * 3),
      asset: 'hud-goreometer',
      scale: 3
    });

    this.hudGoroMeter.smoothed = false;

    this.hudGoreometerBar = new HudObject({
      game: this.game,
      x: 960 - (867 - 87 * 3),
      y: 748 - (21 * 3),
      asset: 'hud-goreometer-bar',
      scale: 3
    });

    this.hudGoreometerBar.smoothed = false;

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
    this.hud.add(this.hudSpeedometer);

    this.game.add.existing(this.hud);

    this.hud.fixedToCamera = true;

    this.game.world.bringToTop(this.hud);

    this.killCountText = this.game.add.text(60, 100, this.killCount, { font: "26px Courier New", fill: "#c31919", align: "center" });
    this.killCountText.fontWeight = 900;
    this.killCountText.fixedToCamera = true;

    this.game.lapCountText = this.game.add.text(60, 33, this.player.lap + "/3", { font: "26px Courier New", fill: "#c31919", align: "center" });
    this.game.lapCountText.fontWeight = 900;
    this.game.lapCountText.fixedToCamera = true;

  }

  showPowOnHud(powType) {
    console.log('showing pow on hud:' + powType);
    var assetPow = '';
    var xFix = 0;

    if (powType == 'nos') {
      assetPow = 'pw-nos';
      xFix = 92;
    } else if (powType == 'carwash') {
      assetPow = 'pw-carwash';
      xFix = 110;
    }

    if (!this.hudPowIcon) {
      this.hudPowIcon = new HudObject({
        game: this.game,
        x: 960 - (xFix),
        y: 45,
        asset: assetPow,
        scale: 3
      });

      this.hud.add(this.hudPowIcon);
    }

  }

  hidePow() {
    console.log('hide pow on hud');
    if (this.hudPowIcon)
      this.hudPowIcon.kill();

    this.hudPowIcon = null;
  }

  loadAudio() {
    this.scream1 = this.game.add.audio('scream1');
    this.scream2 = this.game.add.audio('scream2');
    this.scream3 = this.game.add.audio('scream3');
    this.scream4 = this.game.add.audio('scream4');
    this.game.splash = this.game.add.audio('splash');
    this.game.nos = this.game.add.audio('nos');
    this.game.nos.volume = 0.3;
    this.game.pick = this.game.add.audio('pick');
    this.game.pick.volume = 0.3;
  }

  startCountDown() {
    let sprite = this.game.add.sprite(480, 120, 'checkpoint');
    this.showText(sprite);
  }

  showText(sprite) {
    sprite.anchor.x = 0.5; sprite.anchor.y = 0.5; sprite.smoothed = false;
    sprite.fixedToCamera = true;



    let tween = this.game.add.tween(sprite.scale).to({ x: 3, y: 3 }, 1000, Phaser.Easing.Bounce.Out, false, 1000);
    tween.onComplete.add(function (e) {
      sprite.kill();
      this.game.started = true;
    }, this);
    tween.start();
  }
}
