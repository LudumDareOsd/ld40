import Phaser from 'phaser'
import Path from '../map/Path';

export default class {
    constructor(game) {
        this.game = game;
        this.lastpos = {
            x: 0, y: 0
        }
        this.path = new Path(game);
        this.levelNumber = 1; // currently loaded level #
        this.levelScale = 2; // scale of maptexture
        
        // road collision
        // this.levelCollision = game.physics.p2.createCollisionGroup();
        this.roadPolygons = []; // Polygons that contains the road
        this.roadVerticies = []; // holds points for unfinised polygons
        this.roadLines = []; // this is only for drawing lines on incomplete polygons

        // debug drawing
        this.graphics = game.add.graphics(0, 0);
        this.debug = false;
    }

    editMap(levelNumber) {
        // set correct background, bounds, camera etc;
        this.levelNumber = levelNumber;
        this.currentLevel = game.add.tileSprite(0, 0, 2048, 2048, 'level' + this.levelNumber);
        game.world.setBounds(0, 0, (2048 * this.levelScale), (2048 * this.levelScale));
        this.currentLevel.scale.setTo(this.levelScale);

        // set camera
        // game.camera.width = 320;
        // game.camera.height = 240;

        // set player position etc
        // game.player.x = XXX;

        game.input.onDown.add(this.mouseDown, this);
        game.input.addMoveCallback(this.mouseMove, this);
        game.input.onUp.add(this.mouseUp, this);

        // game.input.mousePointer;
        // game.input.keyboard.isDown(Phaser.Keyboard.LEFT)

        this.key1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.key1.onDown.add(this.addPolygon, this);

        this.undoKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.undoKey.onDown.add(this.undoPolygon, this);

        this.exportKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.exportKey.onDown.add(this.exportLevel, this);
    }

    loadMap(levelNumber) {
        // set correct background, bounds, camera etc;
        this.levelNumber = levelNumber;
        this.currentLevel = game.add.tileSprite(0, 0, 2048, 2048, 'level'+this.levelNumber);
        game.world.setBounds(0, 0, (2048 * this.levelScale), (2048 * this.levelScale));
        this.currentLevel.scale.setTo(this.levelScale);

        // load map from file
        var json = require('../../assets/levels/level'+this.levelNumber+'.json');
        // console.log(json);

        for (var i = 0; i < json.polygons.length; i++) {
            var poly = json.polygons[i];
            this.roadPolygons.push(new Phaser.Polygon(
                poly._points
            ));
            // graphics.beginFill(0xFF33ff);
            this.graphics.lineStyle(2, 0xffffff);
            this.graphics.drawPolygon(poly._points);
            this.graphics.lineTo(poly._points[0].x, poly._points[0].y); // complete polygon...
            // graphics.endFill();
        }

        console.log(this.roadPolygons);
    }



    update() {
        // console.log('map update');
    }

    // render mapedit and debug stuff
    render() {

        // game.debug.cameraInfo(game.camera, 4, 16);
        let tmp = {
            x: game.input.x + game.camera.x,
            y: game.input.y + game.camera.y
        }
        game.debug.text("x:" + tmp.x + " y:" + tmp.y, 830, 710);

        // debug polygons
        for (var i = 0; i < this.roadPolygons.length; i++) {
            var poly = this.roadPolygons[i];
            let col = 'rgba(255,255,255,1)';
            if (poly.contains(tmp.x, tmp.y)) {
                col = 'rgba(255,0,0,1)';
            }

            // for (var j = 0; j < poly.points.length; j++) {
            //     game.debug.geom(poly.points[j], col);
            //     if (i < poly.points.length) {
            //         // game.debug.geom(this.roadLines[i], 'rgba(111,111,255,1)');
            //     }
            // } 
        }

        // draw points 
        for (var i = 0; i < this.roadVerticies.length; i++) {
            game.debug.geom(this.roadVerticies[i], 'rgba(255,255,255,1)');
            // if (i < this.roadLines.length) {
            //     game.debug.geom(this.roadLines[i], 'rgba(111,111,255,1)');
            // }
        } 

        // debug draw lines
        for (var i = 0; i < this.roadLines.length; i++) {
            game.debug.geom(this.roadLines[i], 'rgba(111,111,255,1)');
        } 

    }

    // Removes last added polygon
    undoPolygon() {
        this.graphics = false;
        if (this.roadPolygons.length > 1) {
            this.roadPolygons.splice(-1, 1);
        }
    }

    // Make polygon from current verticies
    addPolygon() {
        this.roadPolygons.push(new Phaser.Polygon(
            this.roadVerticies
        ));

        this.roadLines.push(new Phaser.Line(
            this.roadVerticies[this.roadVerticies.length - 1].x, this.roadVerticies[this.roadVerticies.length - 1].y,
            this.roadVerticies[0].x, this.roadVerticies[0].y
        ));
        // console.table(this.roadPolygons[this.roadPolygons.length-1].points);
        // console.log(this.roadLines.length, this.roadVerticies.length);
        // this.roadLines = [];
        this.roadVerticies = [];
    }

    // 
    mouseDown() {
        if (game.input.activePointer.leftButton.isDown) {
            this.roadVerticies.push(
                new Phaser.Point(
                    game.input.x + game.camera.x,
                    game.input.y + game.camera.y
                )
            );
            if (this.roadVerticies.length > 1) {
                this.roadLines.push(new Phaser.Line(
                    this.roadVerticies[this.roadVerticies.length-2].x, this.roadVerticies[this.roadVerticies.length-2].y,
                    this.roadVerticies[this.roadVerticies.length-1].x, this.roadVerticies[this.roadVerticies.length-1].y
                ));
            }
            console.log(this.roadLines.length, this.roadVerticies.length);
        }
        if (game.input.activePointer.rightButton.isDown) {
            this.isDragging = true;
        }
    }

    // 
    mouseUp() {
        if (game.input.activePointer.rightButton.isDown) {
            this.isDragging = false;
        }
    }

    //
    mouseMove() {
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

    // returns true if point is inside road polygons
    isPointOnRoad(x, y) {
        for (var i = 0; i < this.roadPolygons.length; i++) {
            var poly = this.roadPolygons[i];
            if (poly.contains(x, y)) {
                return true;
            }
        }
        return false;
    }

    // export current level to json
    exportLevel() {
        let levelData = {
            polygons: this.roadPolygons
        };
        let jsonLevel = JSON.stringify(levelData);
        let blob = new Blob([jsonLevel], { type: "application/json" });
        let textToSaveAsURL = window.URL.createObjectURL(blob);
        let fileNameToSaveAs = 'level1' + ".json";

        let downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        downloadLink.href = textToSaveAsURL;
        downloadLink.onclick = this.destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);

        downloadLink.click();
    }
}
