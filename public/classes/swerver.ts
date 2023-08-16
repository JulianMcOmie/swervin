import Phaser from 'phaser';

class Swerver {
    body: MatterJS.BodyType
    color: number;
    radius: number;

    constructor(scene: Phaser.Scene, radius: number, color: number) {
        this.body = scene.matter.add.circle(300, 400, radius, {
            friction: 0.005,
            restitution: 0.0,
            density: 0.04
        });
        this.color = color;
        this.radius = radius;
    }
}

export default Swerver;