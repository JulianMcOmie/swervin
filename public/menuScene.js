class MenuScene extends Phaser.Scene {
  constructor() {
      super({ key: 'MenuScene' });
  }

  create() {
      this.add.text(350, 250, 'Choose a Color:', { fontSize: '24px', fill: '#fff' });

      let redOption = this.add.text(300, 300, 'Red', { fontSize: '32px', fill: '#ff0000' })
          .setInteractive()
          .on('pointerdown', () => this.startGame('0xff0000'));

      let blueOption = this.add.text(450, 300, 'Blue', { fontSize: '32px', fill: '#0000ff' })
          .setInteractive()
          .on('pointerdown', () => this.startGame('0x0000ff'));
  }

  startGame(color) {
      // Start the mainScene and pass in the chosen color as data
      this.scene.start('MainScene', { color: color });
  }
}
