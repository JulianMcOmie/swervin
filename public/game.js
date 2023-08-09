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
  scene: [MainScene]
};

const game = new Phaser.Game(config);