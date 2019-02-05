class SceneC extends BaseRunner {
    constructor() {
        super('sceneC');
        this.tileDataKey = 'slopes';
        this.tileDataSource = 'assets/tiles/slopes2.json';
    }
    preload() {
        super.preload();
    }
    create() {
        super.create();
        this.keys = this.input.keyboard.addKeys({
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }
    update(time, delta) {
        super.update(time, delta);
        console.log("hi");
    }
}