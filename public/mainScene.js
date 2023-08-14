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
        this.playerManager.movePlayer(playerData.Id, playerData.x, playerData.y);
    }

    onUserDisconnect(playerId) {
        console.log("disconnected");
        this.playerManager.removePlayer(playerId);
    }

    //     this.socket.on('connect', () => {
    //         console.log('Connected to the server');
    //         console.log('My socket id is: ', this.socket.id);
    //         this.playerManager.addPlayer(this.socket.id, 300, 400)
    //     });

    //     // Listen for 'currentPlayers' event
    //     this.socket.on('currentPlayers', players => {
    //         // Iterate over all players
    //         for (const id in players) {
    //             if (players.hasOwnProperty(id)) {
    //                 // If the player is the current client
    //                 if (id === this.socket.id) {
    //                     // Add a new player controlled by the client
    //                     this.addSelfPlayer(players[id].x, players[id].y);
    //                 } else {
    //                     // Add a new player controlled by others
    //                     this.addOtherPlayer(id, players[id].x, players[id].y);
    //                 }
    //             }
    //         }
    //     });

    //     // When a new player connects
    //     this.socket.on('newPlayer', (playerData) => {
    //         this.addOtherPlayer(playerData.Id, playerData.x, playerData.y);
    //     });
        
    //     // When a player moves
    //     this.socket.on('playerMoved', (playerData) => {
    //         // You'll need to find this player in your game and update their position.
    //         // This could involve iterating over all players and matching on ID, or storing
    //         // your players in an object where the keys are the socket IDs, similar to the server.
    //         //console.log("Player moved to: " + playerData.x + " " + playerData.y);
    //         this.movePlayer(playerData.Id, playerData.x, playerData.y);
    //     });
        
    //     // When a player disconnects
    //     this.socket.on('userDisconnect', (playerId) => {
    //         // You'll need to find this player and remove them from your game.
    //         console.log("disconnected");
    //         this.removePlayer(playerId);
    //     });

    //     var fullScreenText = this.add.text(10, 10, 'Go Fullscreen', { fill: '#fff' });
    //     fullScreenText.setInteractive();
        
    //     fullScreenText.on('pointerup', function() {
    //         if (this.scale.isFullscreen) {
    //             this.scale.stopFullscreen();
    //         } else {
    //             this.scale.startFullscreen();
    //         }
    //     }, this);

    //     var key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    //     key.on('down', function() {
    //         if (this.scale.isFullscreen) {
    //             this.scale.stopFullscreen();
    //         } else {
    //             this.scale.startFullscreen();
    //         }
    //     }, this);
            
    //     this.graphics = this.add.graphics();

    //     this.graphics.fillStyle(0x0000ff);

    //     this.matter.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

        
    // }

    update() {

    if (this.socket && this.socket.id) {
        this.graphics.clear();

        const pointer = this.input.activePointer;
        this.playerManager.swervePlayer(this.socket.id, pointer.x, pointer.y);

        const playerPosition = this.playerManager.getPlayerPosition(this.socket.id);
        console.log(`Player ${this.socket.id} position:`, playerPosition); // Print current player position

        this.socket.emit("playerMovement", playerPosition);
    }

    const allPlayerPositions = this.playerManager.getAllPlayerPositions();
    for (let playerId in allPlayerPositions) {
        const position = allPlayerPositions[playerId];
        console.log(`Player ${playerId} position:`, position); // Print each player's position
        
        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillCircle(position.x, position.y, 30);
    }
}
    
    // movePlayer(playerId, x, y) {
    //     if (this.players[playerId]) {
    //       this.players[playerId].position.x = x;
    //       this.players[playerId].position.y = y;
    //     }
    // };
      
    // addSelfPlayer(x, y) {
    //     this.players[this.socket.id] = this.matter.add.circle(x, y, 50, {
    //         friction: 0.005,
    //         restitution: 0.0,
    //         density: 0.04
    //     });
    // };

    // addOtherPlayer(playerId, x, y) {
    //     this.players[playerId] = this.matter.add.circle(x, y, 50, {
    //         friction: 0.005,
    //         restitution: 0.0,
    //         density: 0.04
    //     });
    // };

    // removePlayer(playerId) {
    //     delete this.players[playerId];
    // };
    
}

window.MainScene = MainScene;