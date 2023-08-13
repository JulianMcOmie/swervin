const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
      default: 'matter',
      matter: {
          gravity: { y: 0 }
      }
  },
  scene: [MenuScene, MainScene]
};

const game = new Phaser.Game(config);