class BaseRunner extends BaseScene {
    constructor(id) {
        super(id);
        
    }
    preload() {
        super.preload();
    }
    create() {
        super.create();
        //create runner body
        //set speed
        this.player.xForce = 0.005;
        this.player.yForce = 0.1;
        this.createRunnerBody();
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
            if (this.player.direction) {
                this.player.moveRight = true;
            } else {
                this.player.moveLeft = true;
            }
        }
        this.player.update();

        
    }
    createRunnerBody() {
        const Bodies = Phaser.Physics.Matter.Matter.Bodies;
        const { width: w, height: h, x: x, y: y } = this.player.sprite;

        this.player.sensors = {
            left: Bodies.rectangle(x - w + 7, y, 4, 2, {isSensor:true}) ,
            right: Bodies.rectangle(x + w - 7, y, 4, 2, { isSensor: true})
        }
        const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
            parts: [this.player.sprite.body, this.player.sensors.left, this.player.sensors.right],
            friction: 0.001
        });
        this.player.sprite.setExistingBody(compoundBody);

        this.matterCollision.addOnCollideStart({
            objectA: [this.player.sensors.left, this.player.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
        this.player.direction = true;
    }
    onSensorCollide() {
        this.player.direction = !this.player.direction;
    }
}