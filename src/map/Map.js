import Phaser from 'phaser'

export default class {
    constructor() {
        this.lastpos = {
            x: 0, y: 0
        }
    }

    loadMap(mapNumber) {
        this.currentLevel = game.add.tileSprite(0, 0, 2048, 2048, 'level'+mapNumber);
        game.world.setBounds(0, 0, (2048 * 2) - 320, (2048 * 2) - 240);
        this.currentLevel.scale.setTo(2, 2);

        // set camera
        game.camera.width = 320;
        game.camera.height = 240;

        // set player position etc
        // game.player.x = XXX;

        game.input.onDown.add(this.mouseDragStart, this);
        game.input.addMoveCallback(this.mouseDragMove, this);
        game.input.onUp.add(this.mouseDragEnd, this);

        // game.input.mousePointer;
    }

    update() {
        console.log('map update');
    }

    render() {
        // game.debug.cameraInfo(game.camera, 32, 256);
        // this.game
    }


    mouseDragStart() {
        this.isDragging = true;
    }

    mouseDragEnd() {
        this.isDragging = false;
    }

    mouseDragMove() {
        let delta = {
            x: this.lastpos.x - game.input.x,
            y: this.lastpos.y - game.input.y
        }
        if (this.isDragging) {
            game.camera.x += delta.x;
            game.camera.y += delta.y;
        }
        this.lastpos.x = game.input.x; this.lastpos.y = game.input.y;
    }
}
