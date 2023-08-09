const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'matter',
      matter: {
          gravity: { y: 0 }
      }
  },
  scene: [MainScene]
};

const game = new Phaser.Game(config);