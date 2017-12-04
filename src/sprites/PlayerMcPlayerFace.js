import Phaser from 'phaser';
import Util from '../util/util';
import config from '../config';

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset, stateObj, map }) {
        super(game, x, y, asset);
        this.smoothed = false;
        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(2);
        this.stateCaller = stateObj;
        this.map = map;
        this.maxFrames = 5;
        this.frame = 0;

        this.util = new Util();
        this.maxThrust = 1200;
        this.addedThrust = 0;
        this.offRoad = 0;
        this.boost = 0;
        this.gore = 0;
        this.goroMeter = 0;
        this.engineSound = this.game.add.audio('engine');
        this.engineSound.loopFull(0.1);
        this.volume = 0.1;
        this.maxVolume = 0.2;
        this.powKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.gamepad.start();
        this.pad1 = this.game.input.gamepad.pad1;

        this.playerHasPowType = '';
        this.powValue = 0;
        this.powTimeSec = 0;
        this.isPowActivated = false;

        this.lap = 1;
        this.currentCheckpoint = 0;
    }

    update() {

        this.body.damping = 0.94;
        this.body.setZeroRotation();
        this.environmentCheck();

        var isPadUsed = this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad1.connected;
        var isGivingGas = this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.W);
        var isLeft = this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.A);
        var isRight = game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D);

        if (!isGivingGas)
            isGivingGas = isPadUsed && (this.pad1.isDown(Phaser.Gamepad.XBOX360_A));

        if (!isLeft)
            isLeft = (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1);

        if (!isRight)
            isRight = (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1);

        var isPadPow = (this.pad1.justPressed(Phaser.Gamepad.XBOX360_B));

        this.speed = Math.sqrt((this.body.velocity.x * this.body.velocity.x) + (this.body.velocity.y * this.body.velocity.y));
        this.volume = (0.2 + (this.speed * 0.001));
        this.engineSound.volume = this.volume;

        if (isLeft) {
          this.body.rotateLeft(Math.min(50, Math.max(this.speed * 0.15, isGivingGas ? 10 : 0)));
        }
        else if (isRight) {
          this.body.rotateRight(Math.min(50, Math.max(this.speed * 0.15, isGivingGas ? 10 : 0)));
        }

        if (isGivingGas) {
            let totalThrust = this.maxThrust + this.addedThrust + this.boost - this.offRoad - this.gore;
            this.body.thrust(totalThrust);
        }

        if (isPadPow) {
            this.activatePow();
        }

        this.powKey.onDown.add(this.activatePow, this);
        //this.util.constrainVelocity(this, 15);
    }

    environmentCheck() {
        if (!this.map.isPointOnRoad(this.x, this.y)) {
            this.offRoad = 1000;

            if (this.speed > 40 && Math.random() > 0.6) { // add animated smokesprites at back tires
                let v1 = {
                    x: (Math.cos((125 + this.body.angle) * Math.PI / 180)) * 43,
                    y: (Math.sin((125 + this.body.angle) * Math.PI / 180)) * 43
                };
                let v2 = {
                    x: (Math.cos((55 + this.body.angle) * Math.PI / 180)) * 43,
                    y: (Math.sin((55 + this.body.angle) * Math.PI / 180)) * 43
                };

                let m1 = this.game.add.sprite(this.centerX + v1.x, this.centerY + v1.y, 'smoke');
                m1.smoothed = false; m1.scale.setTo(1); m1.anchor.setTo(0.5, 0.5);

                let m2 = this.game.add.sprite(this.centerX + v2.x, this.centerY + v2.y, 'smoke');
                m2.smoothed = false; m2.scale.setTo(1); m2.anchor.setTo(0.5, 0.5);

                // this.game.physics.arcade.enable(m);
                let tween1 = this.game.add.tween(m1).to({alpha:0}, 1000, Phaser.Easing.Linear.Out, false, 0);
                this.game.add.tween(m1.scale).to({ x:4, y:4 }, 1000, Phaser.Easing.Linear.Out, true, 0);
                tween1.onComplete.add(function (e) {
                    m1.kill();
                }, this);
                let tween2 = this.game.add.tween(m2).to({ alpha:0 }, 1000, Phaser.Easing.Linear.Out, false, 0);
                this.game.add.tween(m2.scale).to({ x: 4, y: 4 }, 1000, Phaser.Easing.Linear.Out, true, 0);
                tween2.onComplete.add(function (e) {
                    m2.kill();
                }, this);

                tween1.start();
                tween2.start();
            }
        } else {
            this.offRoad = 0;
        }

        if (this.map.isPointOnBooster(this.x, this.y)) {
            this.boost = 1000;
        } else {
            this.boost = 0;
        }

        if (this.map.isPointOnCheckpoint(this.x, this.y, this.currentCheckpoint)) {
            this.map.checkpoint(this);
            if ((this.currentCheckpoint >= this.map.polygons[this.map.POLYTYPE.checkpoints].length - 1)) {
                this.lap++;
                this.currentCheckpoint = 0;
            } else {
                this.currentCheckpoint++;
            }
            if (this.lap == config.totalLaps) {
                // YOU ARE WINNAR
                this.engineSound.stop();
                this.game.state.start('YouWin');
            }
        }
    }

    activatePow() {
        if (this.isPowActivated == true || this.playerHasPowType == '') {
            return;
        }

        if (this.playerHasPowType == 'nos') {
            this.addThrust(this.powValue, this.powTimeSec);
            this.isPowActivated = true;
        } else if(this.playerHasPowType == 'carwash') {
            this.frame = 0;
            this.stateCaller.powCarWashUse();
            this.isPowActivated = false;
            this.stateCaller.hidePow();
            this.playerHasPowType = '';
        }
    }

    addPow(powType, powValue, powTimeSec) {
        if(this.playerHasPowType == '') {
            this.playerHasPowType = powType;
            this.powValue = powValue;
            this.powTimeSec = powTimeSec;
        }
    }

    addThrust(addThrust, removeThrustSec) {
        this.addedThrust = addThrust;
        this.game.time.events.add(Phaser.Timer.SECOND * removeThrustSec, function () {
            this.removeThrust();
        }, this);
    }

    removeThrust() {
        this.addedThrust = 0;
        this.playerHasPowType = '';
        this.isPowActivated = false;
        this.stateCaller.hidePow();
    }

    increaseGore() {
      if (this.frame < this.maxFrames) {
        this.frame++;
      }
    }

    // http://www.html5gamedevs.com/topic/9835-is-there-a-proper-way-to-limit-the-speed-of-a-p2-body/

}
