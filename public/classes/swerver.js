import Phaser from 'phaser';

class Swerver {
    constructor(scene, radius, color) {
        this.body = scene.matter.add.circle(300, 400, radius, {
            friction: 0.005,
            restitution: 0.0,
            density: 0.04
        });
        this.color = color
        this.radius = radius
    }
}

export default Swerver;