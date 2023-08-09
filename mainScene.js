class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.graphics = this.add.graphics();

        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillCircle(400, 300, 30);

        //this.cameras.main.setBackgroundColor("#0000FF");
        this.matter.world.setBounds(0, 0, 800, 600);

        this.circle = this.matter.add.circle(400, 300, 50, {
            friction: 0.005,
            restitution: 0.0,
            density: 0.04
        });
    }

    update() {
        this.graphics.clear();
        const pointer = this.input.activePointer;
        console.log('Pointer:', pointer);
    
        const target = new Phaser.Math.Vector2(pointer.x, pointer.y);
        console.log('Target:', target);
    
        const velocity = target.subtract(new Phaser.Math.Vector2(this.circle.position.x, this.circle.position.y)).normalize().scale(5);
        //const velocity = new Phaser.Math.Vector2(pointer.x - this.circle.position.x, pointer.y - this.circle.position.y);
        velocity.normalize().scale(5);
        console.log('Velocity:', velocity);
    
        this.matter.body.setVelocity(this.circle, { x: velocity.x, y: velocity.y });
    
        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillCircle(this.circle.position.x, this.circle.position.y, 30);
    
        console.log('Circle Position:', this.circle.position);
    }
    
}

window.MainScene = MainScene;