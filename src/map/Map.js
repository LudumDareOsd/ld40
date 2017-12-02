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
        this.startPosition = {
            x: 0,
            y: 0
        }
        this.POLYTYPE = {
            road: 0,
            boost: 1,
            collision: 2,
            count: 3
        }
        this.selectedLayer = this.POLYTYPE.road;

        this.polygons = []; // Polygons that contains the road etc
        for (var i = 0; i < this.POLYTYPE.count; i++) {
            this.polygons[i] = [];
        }

        this.verticies = []; // holds points for unfinised polygons
        this.debugLines = []; // this is only for drawing lines on incomplete polygons

        // debug drawing
        this.debug = false;
    }

    //
    editMap(levelNumber) {
        // set correct background, bounds, camera etc;
        this.levelNumber = levelNumber;
        this.currentLevel = game.add.tileSprite(0, 0, 2048, 2048, 'level' + this.levelNumber);
        game.world.setBounds(0, 0, (2048 * this.levelScale), (2048 * this.levelScale));
        this.currentLevel.scale.setTo(this.levelScale);

        this.loadMap(levelNumber);

        game.input.onDown.add(this.mouseDown, this);
        game.input.addMoveCallback(this.mouseMove, this);
        game.input.onUp.add(this.mouseUp, this);

        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.addPolygon, this);
        game.input.keyboard.addKey(Phaser.Keyboard.Z).onDown.add(this.undoPolygon, this);
        game.input.keyboard.addKey(Phaser.Keyboard.ONE).onDown.add(function() { this.selectedLayer = this.POLYTYPE.road; }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.TWO).onDown.add(function () { this.selectedLayer = this.POLYTYPE.boost; }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.THREE).onDown.add(function () { this.selectedLayer = this.POLYTYPE.collision; }, this);
        // this.exportKey
        game.input.keyboard.addKey(Phaser.Keyboard.F1).onDown.add(function () { this.loadMap(1); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.F2).onDown.add(function () { this.loadMap(2); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.F3).onDown.add(function () { this.loadMap(3); }, this);

        this.exportKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.exportKey.onDown.add(this.exportLevel, this);

        this.game.camera.follow(null);
    }

    // 
    loadMap(levelNumber) {
        // set correct background, bounds, camera etc;
        this.levelNumber = levelNumber;
        this.currentLevel = game.add.tileSprite(0, 0, 2048, 2048, 'level'+this.levelNumber);
        game.world.setBounds(0, 0, (2048 * this.levelScale), (2048 * this.levelScale));
        this.currentLevel.scale.setTo(this.levelScale);

        // load map from file
        let json = require('../../assets/levels/level'+this.levelNumber+'.json');
        console.log(json);

        this.graphics = this.game.add.graphics(0, 0);
        for (let i = 0; i < json.road.length; i++) {
            let poly = json.road[i];
            this.polygons[this.POLYTYPE.road].push(new Phaser.Polygon(
                poly._points
            ));
            console.log('road');
            this.graphics.lineStyle(1, 0x11eeee);
            this.graphics.drawPolygon(poly._points);
            this.graphics.lineTo(poly._points[0].x, poly._points[0].y); // complete polygon...
        }
        for (let i = 0; i < json.boost.length; i++) {
            let poly = json.boost[i];
            this.polygons[this.POLYTYPE.boost].push(new Phaser.Polygon(
                poly._points
            ));
            console.log('boost');
            this.graphics.lineStyle(1, 0xee11ee);
            this.graphics.drawPolygon(poly._points);
            this.graphics.lineTo(poly._points[0].x, poly._points[0].y); // complete polygon...
        }
        for (let i = 0; i < json.collision.length; i++) {
            let poly = json.collision[i];
            this.polygons[this.POLYTYPE.collision].push(new Phaser.Polygon(
                poly._points
            ));
            console.log('collision');
            this.graphics.lineStyle(1, 0xee11ee);
            this.graphics.drawPolygon(poly._points);
            this.graphics.lineTo(poly._points[0].x, poly._points[0].y); // complete polygon...
        }



        console.log(this.polygons);

        // set player position etc
        // game.player.x = XXX;
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
        game.debug.text("layer:" + this.selectedLayer, 830, 692);

        // // debug polygons
        // for (let i = 0; i < this.roadPolygons.length; i++) {
        //     let poly = this.roadPolygons[i];
        //     let col = 'rgba(255,255,255,1)';
        //     if (poly.contains(tmp.x, tmp.y)) {
        //         col = 'rgba(255,0,0,1)';
        //     }

        //     // for (let j = 0; j < poly.points.length; j++) {
        //     //     game.debug.geom(poly.points[j], col);
        //     //     if (i < poly.points.length) {
        //     //         // game.debug.geom(this.debugLines[i], 'rgba(111,111,255,1)');
        //     //     }
        //     // } 
        // }

        // draw points 
        for (let i = 0; i < this.verticies.length; i++) {
            game.debug.geom(this.verticies[i], 'rgba(255,255,255,1)');
            // if (i < this.debugLines.length) {
            //     game.debug.geom(this.debugLines[i], 'rgba(111,111,255,1)');
            // }
        } 

        // debug draw lines
        for (let i = 0; i < this.debugLines.length; i++) {
            game.debug.geom(this.debugLines[i], 'rgba(111,111,255,1)');
        } 

    }

    // Removes last added polygon
    undoPolygon() {
        if (this.verticies.length > 0) {
            this.verticies.splice(-1, 1);
        }
        if (this.verticies.length > 0) { // already deleted one vert otherwise this should check > 1
            this.debugLines.splice(-1, 1);
        }
    }

    // Make polygon from current verticies
    addPolygon() {
        if (this.verticies.length < 1) {
            return false;
        }
        this.polygons[this.selectedLayer].push(new Phaser.Polygon(
            this.verticies
        ));

        this.debugLines.push(new Phaser.Line(
            this.verticies[this.verticies.length - 1].x, this.verticies[this.verticies.length - 1].y,
            this.verticies[0].x, this.verticies[0].y
        ));
        // console.table(this.roadPolygons[this.roadPolygons.length-1].points);
        // console.log(this.debugLines.length, this.verticies.length);
        // this.debugLines = [];
        this.verticies = [];
    }

    // 
    mouseDown() {
        if (game.input.activePointer.leftButton.isDown) {
            this.verticies.push(
                new Phaser.Point(
                    game.input.x + game.camera.x,
                    game.input.y + game.camera.y
                )
            );
            if (this.verticies.length > 1) {
                this.debugLines.push(new Phaser.Line(
                    this.verticies[this.verticies.length-2].x, this.verticies[this.verticies.length-2].y,
                    this.verticies[this.verticies.length-1].x, this.verticies[this.verticies.length-1].y
                ));
            }
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
        for (let i = 0; i < this.polygons[this.POLYTYPE.road].length; i++) {
            let poly = this.polygons[this.POLYTYPE.road][i];
            if (poly.contains(x, y)) {
                return true;
            }
        }
        return false;
    }

    // returns true if point is inside a boosterpolygon
    isPointOnBooster(x, y) {
        for (let i = 0; i < this.polygons[this.POLYTYPE.boost].length; i++) {
            let poly = this.polygons[this.POLYTYPE.boost][i];
            if (poly.contains(x, y)) {
                return true;
            }
        }
        return false;
    }


    // export current level to json
    exportLevel() {
        let levelData = {
            road: this.polygons[this.POLYTYPE.road],
            boost: this.polygons[this.POLYTYPE.boost],
            collision: this.polygons[this.POLYTYPE.collision]
            // add start position etc
        };
        let jsonLevel = JSON.stringify(levelData);
        console.log(jsonLevel);
        let blob = new Blob([jsonLevel], { type: "application/json" });
        let textToSaveAsURL = window.URL.createObjectURL(blob);
        let fileNameToSaveAs = 'level' + this.levelNumber + ".json";

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
