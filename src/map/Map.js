import Phaser from 'phaser'
import Path from '../map/Path';

export default class {
    constructor(game, state) {
        this.game = game;
        this.state = state;
        this.lastpos = {
            x: 0, y: 0
        }
        this.path = new Path(game);
        this.levelNumber = 1; // currently loaded level #
        this.levelScale = 2; // scale of maptexture
        this.startPositions = [
            new Phaser.Point(0, 0), new Phaser.Point(0, 0), new Phaser.Point(0, 0),
            new Phaser.Point(0, 0), new Phaser.Point(0, 0), new Phaser.Point(0, 0)
        ];
        this.startRects = [ // just for debugging
            new Phaser.Rectangle(0, 0, 20, 20), new Phaser.Rectangle(0, 0, 20, 20), new Phaser.Rectangle(0, 0, 20, 20),
            new Phaser.Rectangle(0, 0, 20, 20), new Phaser.Rectangle(0, 0, 20, 20), new Phaser.Rectangle(0, 0, 20, 20)
        ];
        this.selectedPosition = 0;
        this.POLYTYPE = {
            road: 0,
            boost: 1,
            collision: 2,
            checkpoints: 3,
            count: 4
        }
        this.selectedLayer = this.POLYTYPE.road;

        this.polygons = []; // Polygons that contains the road etc
        for (let i = 0; i < this.POLYTYPE.count; i++) {
            this.polygons[i] = [];
        }

        this.verticies = []; // holds points for unfinised polygons
        this.debugLines = []; // this is only for drawing lines on incomplete polygons

        // debug drawing
        this.debug = false;
    }

    //
    editMap(levelNumber) {
        this.loadMap(levelNumber, null, null, null);

        this.game.input.onDown.add(this.mouseDown, this);
        this.game.input.addMoveCallback(this.mouseMove, this);
        this.game.input.onUp.add(this.mouseUp, this);

        this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.addPolygon, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.Z).onDown.add(this.undoPolygon, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.ONE).onDown.add(function() { this.selectedLayer = this.POLYTYPE.road; }, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.TWO).onDown.add(function () { this.selectedLayer = this.POLYTYPE.boost; }, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.THREE).onDown.add(function () { this.selectedLayer = this.POLYTYPE.collision; }, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR).onDown.add(function () { this.selectedLayer = this.POLYTYPE.checkpoints; }, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function () {
            this.startPositions[this.selectedPosition].x = this.game.input.x + this.game.camera.x;
            this.startPositions[this.selectedPosition].y = this.game.input.y + this.game.camera.y;
            this.startRects[this.selectedPosition].x = this.startPositions[this.selectedPosition].x - 10;
            this.startRects[this.selectedPosition].y = this.startPositions[this.selectedPosition].y - 10;
            this.selectedPosition = (this.selectedPosition >= this.startPositions.length - 1) ? 0 : this.selectedPosition + 1;
        }, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.X).onDown.add(function () { this.path.add(this.game.input.x + this.game.camera.x - 150, this.game.input.y + this.game.camera.y - 150); }, this);
        // this.game.input.keyboard.addKey(Phaser.Keyboard.V).onDown.add(function () { this.path.pathPoints.splice(-1, 1); console.log(this.path.pathPoints.length); }, this);
        this.exportKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.exportKey.onDown.add(this.exportLevel, this);

        this.game.camera.follow(null);
    }

    // 
    loadMap(levelNumber, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, pedoCollisionGroup) {
        // set correct background, bounds, camera etc;
        this.levelNumber = levelNumber;
        this.currentLevel = game.add.tileSprite(0, 0, 2048, 2048, 'level'+this.levelNumber);
        this.game.world.setBounds(0, 0, (2048 * this.levelScale), (2048 * this.levelScale));
        this.currentLevel.scale.setTo(this.levelScale);

        // load map from file
        let json = require('../../assets/levels/level'+this.levelNumber+'.json');
        console.log(this.game);

        this.graphics = this.game.add.graphics(0, 0);
        for (let i = 0; i < json.road.length; i++) {
            let poly = json.road[i];
            this.polygons[this.POLYTYPE.road].push(new Phaser.Polygon(
                poly._points
            ));
            // this.graphics.lineStyle(1, 0x11eeee);
            // this.graphics.drawPolygon(poly._points);
            // this.graphics.lineTo(poly._points[0].x, poly._points[0].y); // complete polygon...
        }
        for (let i = 0; i < json.boost.length; i++) {
            let poly = json.boost[i];
            this.polygons[this.POLYTYPE.boost].push(new Phaser.Polygon(
                poly._points
            ));
            // this.graphics.lineStyle(1, 0xee11ee);
            // this.graphics.drawPolygon(poly._points);
            // this.graphics.lineTo(poly._points[0].x, poly._points[0].y); // complete polygon...
        }
        for (let i = 0; i < json.collision.length; i++) {
            let poly = json.collision[i];
            this.polygons[this.POLYTYPE.collision].push(new Phaser.Polygon(
                poly._points
            ));
            // this.graphics.lineStyle(1, 0xee11ee);
            // this.graphics.drawPolygon(poly._points);
            // this.graphics.lineTo(poly._points[0].x, poly._points[0].y); // complete polygon...
        }
        for (let i = 0; i < json.checkpoints.length; i++) {
            let poly = json.checkpoints[i];
            this.polygons[this.POLYTYPE.checkpoints].push(new Phaser.Polygon(
                poly._points
            ));
            // this.graphics.lineStyle(1, 0xfef111);
            // this.graphics.drawPolygon(poly._points);
            // this.graphics.lineTo(poly._points[0].x, poly._points[0].y); // complete polygon...
        }

        for (let i = 0; i < json.startPositions.length; i++) {
            this.startPositions[i] = json.startPositions[i];
            this.startRects[i].x = this.startPositions[i].x - 10;
            this.startRects[i].y = this.startPositions[i].y - 10;
        }

        this.path.pathPoints = [];
        for (let i = 0; i < json.path.length; i++) {
            let p = json.path[i];
            this.path.add(p.x, p.y);
        }

        // set player position etc
        this.state.player.body.x = this.startPositions[0].x;
        this.state.player.body.y = this.startPositions[0].y;

        if (powerUpCollisionGroup && opponentCollisionGroup && pedoCollisionGroup) {
            this.state.createOpponents(this.path, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, pedoCollisionGroup, this.startPositions[1].x, this.startPositions[1].y, this);
            this.state.createOpponents(this.path, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, pedoCollisionGroup, this.startPositions[2].x, this.startPositions[2].y, this);
            this.state.createOpponents(this.path, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, pedoCollisionGroup, this.startPositions[3].x, this.startPositions[3].y, this);
            this.state.createOpponents(this.path, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, pedoCollisionGroup, this.startPositions[4].x, this.startPositions[4].y, this);
            this.state.createOpponents(this.path, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, pedoCollisionGroup, this.startPositions[5].x, this.startPositions[5].y, this);
        }

        // Emil approved hardcode
        if (levelNumber == 1) {
            this.state.player.body.angle = 270;
        }
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


        // for (let i = 0; i < this.startRects.length; i++) {
        //     let rect = this.startRects[i];
        //     game.debug.geom(rect);
        // }

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

    // returns true if point is inside a checkpooint
    isPointOnCheckpoint(x, y, key) {
        if (key < this.polygons[this.POLYTYPE.checkpoints].length) {
            let poly = this.polygons[this.POLYTYPE.checkpoints][key];
            if (poly.contains(x, y)) {
                return true;
            }
        }
        return false;
    }

    // checkpoint triggered
    checkpoint(self) {
        // 480(half screeen)
        let s = this.game.add.sprite(480, 120, 'checkpoint');
        s.anchor.x = 0.5; s.anchor.y = 0.5;
        s.fixedToCamera = true;
        let tween = this.game.add.tween(s.scale).to({ x: 3, y: 3 }, 1000, Phaser.Easing.Bounce.Out, false, 0); 
        tween.onComplete.add(function(e) { 
            s.kill();
        }, this);
        tween.start();

        // s.sendT();
        // this.map.currentLevel.sendToBack();
        // this.game.
    }

    // export current level to json
    exportLevel() {
        let pp = [];
        for (var i = 0; i < this.path.pathPoints.length; i++) {
            var element = this.path.pathPoints[i];
            pp.push({
                x: element.x,
                y: element.y
            });
        }
        let levelData = {
            road: this.polygons[this.POLYTYPE.road],
            boost: this.polygons[this.POLYTYPE.boost],
            collision: this.polygons[this.POLYTYPE.collision],
            checkpoints: this.polygons[this.POLYTYPE.checkpoints],
            path: pp,
            startPositions: this.startPositions
            // add start position etc
        };
        let jsonLevel = JSON.stringify(levelData);
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
