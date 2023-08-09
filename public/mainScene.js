class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {

        var fullScreenText = this.add.text(10, 10, 'Go Fullscreen', { fill: '#fff' });
        fullScreenText.setInteractive();
        
        fullScreenText.on('pointerup', function() {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        }, this);

        var key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        key.on('down', function() {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        }, this);
            
        this.graphics = this.add.graphics();

        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillCircle(400, 300, 30);

        //this.cameras.main.setBackgroundColor("#0000FF");
        this.matter.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

        this.circle = this.matter.add.circle(400, 300, 50, {
            friction: 0.005,
            restitution: 0.0,
            density: 0.04
        });
    }

    update() {
        this.graphics.clear();
        const pointer = this.input.activePointer;
    
        const target = new Phaser.Math.Vector2(pointer.x, pointer.y);
        
        let velocity = target.subtract(new Phaser.Math.Vector2(this.circle.position.x, this.circle.position.y));
        const maxVelocity = velocity.normalize().scale(150);
        if (velocity.length() > maxVelocity.length()) {
            velocity = maxVelocity;
        }

        let speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

        let forceMagnitude = 0.0019;
        let force = { x: velocity.x * forceMagnitude, y: velocity.y * forceMagnitude };
    
        this.matter.body.applyForce(this.circle, this.circle.position, force);

        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillCircle(this.circle.position.x, this.circle.position.y, 30);
    }
    
}

window.MainScene = MainScene;