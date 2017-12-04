/* globals __DEV__ */
import Phaser from 'phaser'
import Map from '../map/Map';

export default class extends Phaser.State {

    init() { }
    preload() { }

    create() {
        // this.physics.startSystem(Phaser.Physics.P2JS);
        this.map = new Map(game, this);
        // this.map.editMap(2);

        game.input.onDown.add(this.map.mouseDown, this.map);
        game.input.addMoveCallback(this.map.mouseMove, this.map);
        game.input.onUp.add(this.map.mouseUp, this.map);

        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.map.addPolygon, this.map);
        game.input.keyboard.addKey(Phaser.Keyboard.Z).onDown.add(this.map.undoPolygon, this.map);
        game.input.keyboard.addKey(Phaser.Keyboard.ONE).onDown.add(function () { this.map.selectedLayer = this.map.POLYTYPE.road; }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.TWO).onDown.add(function () { this.map.selectedLayer = this.map.POLYTYPE.boost; }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.THREE).onDown.add(function () { this.map.selectedLayer = this.map.POLYTYPE.collision; }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.FOUR).onDown.add(function () { this.map.selectedLayer = this.map.POLYTYPE.checkpoints; }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function () {
            this.map.startPositions[this.map.selectedPosition].x = game.input.x + game.camera.x;
            this.map.startPositions[this.map.selectedPosition].y = game.input.y + game.camera.y;
            this.map.startRects[this.map.selectedPosition].x = this.map.startPositions[this.map.selectedPosition].x - 10;
            this.map.startRects[this.map.selectedPosition].y = this.map.startPositions[this.map.selectedPosition].y - 10;
            this.map.selectedPosition = (this.map.selectedPosition >= this.map.startPositions.length - 1) ? 0 : this.map.selectedPosition + 1;
        }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.X).onDown.add(function () {
            this.map.path.add(game.input.x + game.camera.x - 150, game.input.y + game.camera.y - 150, true);
        }, this);
        // game.input.keyboard.addKey(Phaser.Keyboard.V).onDown.add(function () { this.map.path.pathPoints.splice(-1, 1); console.log(this.map.path.pathPoints.length); }, this.map);
        game.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.map.exportLevel, this.map);

        this.map.loadMap(3);

        game.camera.follow(null);
    }

    render() {
        this.map.render();
        if (__DEV__) {
            //game.debug.spriteInfo(this.player, 32, 32)
        }
    }

}
