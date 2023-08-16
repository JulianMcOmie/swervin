class MenuScene extends Phaser.Scene {
  constructor() {
      super({ key: 'MenuScene' });
  }

  create() {
      this.add.text(window.innerWidth / 2 - 200, window.innerHeight / 2 - 200, 'Choose a Color:', { fontSize: '24px', fill: '#fff' });

      let redOption = this.add.text(window.innerWidth / 2 - 10 - 200 , window.innerHeight / 2 - 100, 'Red', { fontSize: '32px', fill: '#ff0000' })
          .setInteractive()
          .on('pointerdown', () => this.startGame('0xff0000'));

      let blueOption = this.add.text(window.innerWidth / 2 + 150 - 200, window.innerHeight / 2 - 100, 'Blue', { fontSize: '32px', fill: '#0000ff' })
          .setInteractive()
          .on('pointerdown', () => this.startGame('0x0000ff'));
  }

  startGame(color) {
      // Start the mainScene and pass in the chosen color as data
      this.scene.start('MainScene', { color: color });
  }
}

export default MenuScene;