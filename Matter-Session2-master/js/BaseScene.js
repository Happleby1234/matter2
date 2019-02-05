class BaseScene extends Phaser.Scene {
    constructor(id) {
        super(id);
        this.id = id;
        this.tileDataKey;
        this.tileDataSource;
        this.emojiCount = 0;
        this.emojiTime = 0;
    }
    preload() {
        this.load.tilemapTiledJSON(this.tileDataKey, this.tileDataSource);
        this.load.atlas('emoji', 'assets/sprites/emoji.png', 'assets/sprites/emoji.json');
        this.load.image('exit', 'assets/sprites/exit.png');
    }
    create() {
        const map = this.make.tilemap({ key: this.tileDataKey });
        const tileset = map.addTilesetImage('kenney-tileset');
        this.background = map.createStaticLayer('background', tileset, 0, 0);
        this.land = map.createStaticLayer('platforms', tileset, 0, 0);
        this.foreground = map.createStaticLayer('foreground', tileset, 0, 0);
        this.land.setCollisionByProperty({ collides: true });
        const myLand = this.matter.world.convertTilemapLayer(this.land); //TODO
        this.player = new Player(this, 380,128);
        this.player.sprite.label = 'player'
        this.exit = this.matter.add.sprite(450, 288, 'exit');
        this.exit.setStatic(true);
        this.exit.label = 'exit';



        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);
        this.matter.world.on('collisionstart', this.handleCollision, this);
        this.matter.world.on('collisionactive', this.handleCollision, this);

    }
    update(time, delta) {

        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            switch (this.id) {
                case 'sceneA':
                    this.scene.switch('sceneB');
                    break;
                case 'sceneB':
                    this.scene.switch('sceneC');
                    break;
                case 'sceneC':
                    this.scene.switch('sceneA');
                    break;
            }
        }
        if (this.emojiCount < 20 && this.emojiTime == 0) {
            this.makeEmoji();
            this.emojiCount++;
            this.emojiTime = time;
        } else if (time > this.emojiTime + 2000) {
            this.emojiTime = 0;
        }
        this.player.update();
    }

    handleCollision(event) {
        event.pairs.forEach(this.matchCollisionPair, this);

    }

    matchCollisionPair(pair) {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        let myPair = [null, null];
        if (bodyA.gameObject && bodyA.gameObject.label) {
            this.sortCollisionObjects(bodyA.gameObject.label, myPair);
        }
        if (bodyB.gameObject && bodyB.gameObject.label) {
            this.sortCollisionObjects(bodyB.gameObject.label, myPair);
        }
        if (myPair[0] == 'player' && myPair[1] == 'exit') {
            this.changeScene();
            //console.log('ouch')
        }
    }

    sortCollisionObjects(label, arr) {
        switch (label) {
            case 'player':
                arr[0] = 'player';
                break
            case 'exit':
                arr[1] = 'exit';
                break
        }
    }

    changeScene() {
        switch (this.id) {
            case 'sceneA':
                this.scene.start('sceneB');
                break
            case 'sceneB':
                this.scene.start('sceneC');
                break
            case 'sceneC':
                this.scene.switch('sceneA');
                break;
        }
    }


    makeEmoji() {
        const frameNames = Object.keys(this.cache.json.get('emoji').frames);
        const frame = Phaser.Utils.Array.GetRandom(frameNames);
        console.log('random emoji = ' + frame)
        let emoji = this.matter.add.image(150, 32, 'emoji', frame, { restitution: 1, friction: 0.5, density: 0.01, shape: 'circle' });
        emoji.setScale(0.5);
    }
}
