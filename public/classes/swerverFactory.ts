import { Scene } from 'phaser'; // Assuming you're using Phaser
import Swerver from './swerver.js'; // Import Swerver class from swerver.js

class SwerverFactory {
    static createRacer(scene: any): Swerver {
        return new Swerver(scene, 15, "0xff0000");
    }
    static createBully(scene: any): Swerver {
        return new Swerver(scene, 75, "0x0000ff");
    }
}

export default SwerverFactory;