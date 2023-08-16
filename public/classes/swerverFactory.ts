import { Scene } from 'phaser'; // Assuming you're using Phaser
import Swerver from './swerver'; // Import Swerver class from swerver.js
import SwerverType, { SwerverRenderer } from './swerverType';

class SwerverFactory {
    static createSwerver(scene: Phaser.Scene, type: SwerverType): Swerver {
        return new Swerver(scene, type, SwerverRenderer.radiusFor(type));
    }
}

export default SwerverFactory;