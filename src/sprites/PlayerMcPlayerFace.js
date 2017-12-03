import Phaser from 'phaser';
import Util from '../util/util';

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset, stateObj, map}) {
        super(game, x, y, asset);
        this.anchor.setTo(0.5, 0.8);
        this.scale.setTo(2);
        this.stateCaller = stateObj;
        this.map = map;

        this.util = new Util();
        this.maxThrust = 1000;
        this.addedThrust = 0;
        this.offRoad = 0;
        this.boost = 0;
        this.powKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

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

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.body.rotateLeft(50);
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.body.rotateRight(50);
            }
            this.body.thrust(this.maxThrust + this.addedThrust + this.boost - this.offRoad);

        } else {
            if (Math.abs(this.body.velocity.x) > 100 || Math.abs(this.body.velocity.y) > 100) {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                    this.body.rotateLeft(10);
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                    this.body.rotateRight(10);
                }
            }
        }

        this.powKey.onDown.add(this.activatePow, this);
        //this.util.constrainVelocity(this, 15);
    }

    environmentCheck() {
        if(!this.map.isPointOnRoad(this.x, this.y)) {
            this.offRoad = 600;
        } else {
            this.offRoad = 0;
        }

        if(this.map.isPointOnBooster(this.x, this.y)) {
            this.boost = 800;
        } else {
            this.boost = 0;
        }

        if (this.map.isPointOnCheckpoint(this.x, this.y, this.currentCheckpoint)) {
            // WE HAVE HIT NEXT CHECKPOINT, todo: SOME FLASHY SHIT??
            console.log('CHECKPOINT HIT: ' + this.currentCheckpoint + ' MAX:' + this.map.polygons[this.map.POLYTYPE.checkpoints].length + ' LAP:' + this.lap);
            if ((this.currentCheckpoint >= this.map.polygons[this.map.POLYTYPE.checkpoints].length - 1)) {
                this.lap++;
                this.currentCheckpoint = 0;
            } else {
                 this.currentCheckpoint++;
            }
            // WE HAVE FINISHED LAP 3
            if (this.lap == 4) {
                console.log('YOU ARE WINNAR');
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
