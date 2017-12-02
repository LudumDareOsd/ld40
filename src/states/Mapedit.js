/* globals __DEV__ */
import Phaser from 'phaser'
import Map from '../map/Map';

export default class extends Phaser.State {

    init() { }
    preload() { }

    create() {
        this.physics.startSystem(Phaser.Physics.P2JS);

        this.map = new Map();
        this.map.editMap(1);
    }

    render() {
        this.map.render();
        if (__DEV__) {
            //this.game.debug.spriteInfo(this.player, 32, 32)
        }
    }

}
