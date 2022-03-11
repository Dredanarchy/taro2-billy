var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super.call(this, { key: 'Game' }) || this;
    }
    GameScene.prototype.init = function () {
        // TODO move to css once pixi is gone
        // phaser canvas adjustments
        var canvas = this.game.canvas;
        canvas.style.position = 'fixed';
        canvas.style.opacity = '0.5';
        canvas.style.backgroundColor = 'transparent';
    };
    GameScene.prototype.preload = function () {
        var _this = this;
        var data = ige.game.data;
        for (var type in data.unitTypes) {
            this.loadEntity("unit/".concat(type), data.unitTypes[type]);
        }
        for (var type in data.projectileTypes) {
            this.loadEntity("projectile/".concat(type), data.projectileTypes[type]);
        }
        for (var type in data.itemTypes) {
            this.loadEntity("item/".concat(type), data.itemTypes[type]);
        }
        data.map.tilesets.forEach(function (tileset) {
            _this.load.image("tiles/".concat(tileset.name), tileset.image);
        });
        this.load.tilemapTiledJSON('map', data.map);
    };
    GameScene.prototype.loadEntity = function (key, data) {
        var _this = this;
        var cellSheet = data.cellSheet;
        if (!cellSheet) { // skip if no cell sheet data
            return;
        }
        this.load.image(key, cellSheet.url);
        if (cellSheet.rowCount === 1 && // skip if not a spritesheet
            cellSheet.columnCount === 1) {
            return;
        }
        this.load.once("filecomplete-image-".concat(key), function () {
            // create spritesheet
            var texture = _this.textures.get(key);
            var width = texture.source[0].width;
            var height = texture.source[0].height;
            Phaser.Textures.Parsers.SpriteSheet(texture, 0, 0, 0, width, height, {
                frameWidth: width / cellSheet.columnCount,
                frameHeight: height / cellSheet.rowCount,
            });
            // add animations
            for (var animationsKey in data.animations) {
                var animation = data.animations[animationsKey];
                var frames_1 = animation.frames;
                // skip if it's an empty animation
                if (frames_1.length === 1 && frames_1[0] === 1) {
                    continue;
                }
                var animationFrames = [];
                for (var i = 0; i < frames_1.length; i++) {
                    // correction for 0-based indexing
                    animationFrames.push(frames_1[i] - 1);
                }
                _this.anims.create({
                    key: "".concat(key, "/").concat(animation.name),
                    frames: _this.anims.generateFrameNumbers(key, {
                        frames: animationFrames
                    }),
                    frameRate: animation.framesPerSecond || 15,
                    repeat: (animation.loopCount - 1) // correction for loop/repeat values
                });
            }
        });
    };
    GameScene.prototype.create = function () {
        ige.client.phaserLoaded.resolve();
        var map = this.make.tilemap({ key: 'map' });
        var data = ige.game.data;
        data.map.tilesets.forEach(function (tileset) {
            map.addTilesetImage(tileset.name, "tiles/".concat(tileset.name));
        });
        data.map.layers.forEach(function (layer) {
            if (layer.type !== 'tilelayer') {
                return;
            }
            console.log(layer.name);
            map.createLayer(layer.name, map.tilesets[0], 0, 0);
        });
        this.cameras.main.centerOn(map.width * map.tileWidth / 2, map.height * map.tileHeight / 2);
        this.cameras.main.zoom = this.scale.width / 800;
        var cursors = this.input.keyboard.createCursorKeys();
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        });
    };
    GameScene.prototype.update = function (time, delta) {
        this.controls.update(delta);
    };
    return GameScene;
}(Phaser.Scene));
//# sourceMappingURL=GameScene.js.map