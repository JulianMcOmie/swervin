import Phaser from 'phaser'; // Import Phaser from node_modules
import MenuScene from './menuScene';
import MainScene from './mainScene'; // Adjust path as needed


const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
      default: 'matter',
      matter: {
          gravity: { y: 0 }
      }
  },
  scene: [MainScene]
};

const game: Phaser.Game = new Phaser.Game(config);