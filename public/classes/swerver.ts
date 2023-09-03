import Phaser from 'phaser';
import SwerverType from './swerverType';

class Swerver {
    body: MatterJS.BodyType
    type: SwerverType
    size: number; // The size (radius) used in physics calculation

    constructor(scene: Phaser.Scene, type: SwerverType, size: number) {
        this.body = scene.matter.add.circle(300, 400, size, {
            friction: 0.005,
            restitution: 0.0,
            density: 0.04
        });
        this.type = type;
        this.size = size;
    }
}

export default Swerver;