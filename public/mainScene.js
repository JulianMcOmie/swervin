class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.playerManager = new PlayerManager(this);
    }

    create() {
        this.socket = io();
        this.setEventListeners();
        this.initFullScreen();
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x0000ff);
        this.matter.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
    }

    setEventListeners() {
      this.socket.on('connect', this.onConnect.bind(this));
      this.socket.on('currentPlayers', this.onCurrentPlayers.bind(this));
      this.socket.on('newPlayer', this.onNewPlayer.bind(this));
      this.socket.on('playerMoved', this.onPlayerMoved.bind(this));
      this.socket.on('userDisconnect', this.onUserDisconnect.bind(this));
    }

    initFullScreen() {
      var fullScreenText = this.add.text(10, 10, 'Go Fullscreen', { fill: '#fff' });
      fullScreenText.setInteractive();
      
      fullScreenText.on('pointerup', this.toggleFullScreen.bind(this));

      var key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      key.on('down', this.toggleFullScreen.bind(this));
    }

    toggleFullScreen() {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
        } else {
            this.scale.startFullscreen();
        }
    }  

    onConnect() {
      console.log('Connected to the server');
      console.log('My socket id is: ', this.socket.id);
      this.playerManager.addPlayer(this.socket.id, 300, 400);
    }

    onCurrentPlayers(players) {
        Object.keys(players).forEach(id => {
            if (id === this.socket.id) {
                this.playerManager.addPlayer(id, players[id].x, players[id].y);
            } else {
                this.playerManager.addPlayer(id, players[id].x, players[id].y);
            }
        });
    }

    onNewPlayer(playerData) {
        this.playerManager.addPlayer(playerData.Id, playerData.x, playerData.y);
    }

    onPlayerMoved(playerData) {
        this.playerManager.movePlayer(playerData.Id, playerData.movementData);
    }

    onUserDisconnect(playerId) {
        console.log("disconnected: " + playerId);
        this.playerManager.removePlayer(playerId);
    }

    update() {

    if (this.socket && this.socket.id) {
        this.graphics.clear();

        const pointer = this.input.activePointer;
        this.playerManager.swervePlayer(this.socket.id, pointer.x, pointer.y);

        const playerMovementData = this.playerManager.getPlayerMovementData(this.socket.id);

        this.socket.emit("playerMovement", playerMovementData);
    }

    const allPlayerPositions = this.playerManager.getAllPlayerPositions();
    for (let playerId in allPlayerPositions) {
        const position = allPlayerPositions[playerId];
        
        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillCircle(position.x, position.y, 30);
    }
}

    
}

window.MainScene = MainScene;