import Phaser from 'phaser';
import Util from '../util/util';

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset, stateObj, map}) {
        super(game, x, y, asset);
        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(2);
        this.stateCaller = stateObj;
        this.map = map;

        this.util = new Util();
        this.maxThrust = 1200;
        this.addedThrust = 0;
        this.offRoad = 0;
        this.boost = 0;
        this.gore = 0;
        this.goroMeter = 0;
        this.powKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.gamepad.start();
        this.pad1 = this.game.input.gamepad.pad1;

        this.playerHasPowType = '';
        this.powValue = 0;
        this.powTimeSec = 0;
        this.isPowActivated = false;

        this.lap = 0;
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

        if(!isGivingGas)
            isGivingGas = isPadUsed && (this.pad1.isDown(Phaser.Gamepad.XBOX360_A));
        
        if(!isLeft)
            isLeft = (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1);

        if(!isRight)
            isRight = (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1);
            
        var isPadPow = (this.pad1.justPressed(Phaser.Gamepad.XBOX360_B));

        if (isGivingGas) {

            if (isLeft) {
                this.body.rotateLeft(50);
            }
            else if (isRight) {
                this.body.rotateRight(50);
            }
            this.body.thrust(this.maxThrust + this.addedThrust + this.boost - this.offRoad - this.gore);

        } else {
            if (Math.abs(this.body.velocity.x) > 100 || Math.abs(this.body.velocity.y) > 100) {
                if (isLeft) {
                    this.body.rotateLeft(10);
                }
                else if (isRight) {
                    this.body.rotateRight(10);
                }
            }
        }

        if(isPadPow) {
            this.activatePow();
        }

        this.powKey.onDown.add(this.activatePow, this);
        //this.util.constrainVelocity(this, 15);
    }

    environmentCheck() {
        if(!this.map.isPointOnRoad(this.x, this.y)) {
            this.offRoad = 1000;

            if ((Math.abs(this.body.velocity.x) > 25 || Math.abs(this.body.velocity.y) > 25) && Math.random() > 0.5) {
                
                let v1 = { 
                    x: (Math.cos((130 + this.body.angle) * Math.PI / 180)) * 35,
                    y: (Math.sin((130 + this.body.angle) * Math.PI / 180)) * 35
                };
                let v2 = {
                    x: (Math.cos((50 + this.body.angle) * Math.PI / 180)) * 35,
                    y: (Math.sin((50 + this.body.angle) * Math.PI / 180)) * 35
                };
                // console.log(this.body);
                // console.log(v);
    
                let m1 = this.game.add.sprite(this.centerX + v1.x, this.centerY + v1.y, 'smoke');
                m1.smoothed = false; m1.scale.setTo(1); m1.anchor.setTo(0.5, 0.5);

                let m2 = this.game.add.sprite(this.centerX + v2.x, this.centerY + v2.y, 'smoke');
                m2.smoothed = false; m2.scale.setTo(1); m2.anchor.setTo(0.5, 0.5);

                // this.game.physics.arcade.enable(m);
                let tween1 = this.game.add.tween(m1).to({alpha:0}, 1000, Phaser.Easing.Linear.Out, false, 0);
                tween1.onComplete.add(function (e) {
                    m1.kill();
                }, this);
                let tween2 = this.game.add.tween(m2).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.Out, false, 0);
                tween2.onComplete.add(function (e) {
                    m2.kill();
                }, this);
                
                tween1.start();
                tween2.start();
            }
        } else {
            this.offRoad = 0;
        }

        if(this.map.isPointOnBooster(this.x, this.y)) {
            this.boost = 1000;
        } else {
            this.boost = 0;
        }

        if (this.map.isPointOnCheckpoint(this.x, this.y, this.currentCheckpoint)) {
            // WE HAVE HIT NEXT CHECKPOINT, todo: SOME FLASHY SHIT??
            this.map.checkpoint(this);
            // console.log('CHECKPOINT HIT: ' + this.currentCheckpoint + ' MAX:' + this.map.polygons[this.map.POLYTYPE.checkpoints].length + ' LAP:' + this.lap);
            if ((this.currentCheckpoint >= this.map.polygons[this.map.POLYTYPE.checkpoints].length - 1)) {
                this.lap++;
                this.currentCheckpoint = 0;
            } else {
                 this.currentCheckpoint++;
            }
            // WE HAVE FINISHED LAP 3
            if (this.lap == 4) {
                // console.log('YOU ARE WINNAR');
            }
        }
    }

    activatePow() {

        if(this.isPowActivated == true || this.playerHasPowType == '') {
            return;
        }

        console.log('activate pow');

        if(this.playerHasPowType == 'nos') {
            this.addThrust(this.powValue, this.powTimeSec);
            this.isPowActivated = true;
        }
    }

    addPow(powType, powValue, powTimeSec) {
        console.log('added pow ' + powType);

        if(this.playerHasPowType != powType) {
            this.playerHasPowType = powType;
            this.powValue = powValue;
            this.powTimeSec = powTimeSec;
        }
    }

    addThrust(addThrust, removeThrustSec) {
        this.addedThrust = addThrust;

        this.game.time.events.add(Phaser.Timer.SECOND * removeThrustSec, function() {
            this.removeThrust();
        }, this);
    }

    removeThrust() {
        this.addedThrust = 0;
        this.playerHasPowType = '';
        this.isPowActivated = false;
        this.stateCaller.hidePow();
    }

    // http://www.html5gamedevs.com/topic/9835-is-there-a-proper-way-to-limit-the-speed-of-a-p2-body/

}
