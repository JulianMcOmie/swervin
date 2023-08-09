class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.socket = io();
        this.players = {};

        this.socket.on('connect', () => {
            console.log('Connected to the server');
            console.log('My socket id is: ', this.socket.id);
            this.addSelfPlayer(300, 400);
        });

        // Listen for 'currentPlayers' event
        this.socket.on('currentPlayers', players => {
            // Iterate over all players
            for (const id in players) {
                if (players.hasOwnProperty(id)) {
                    // If the player is the current client
                    if (id === this.socket.id) {
                        // Add a new player controlled by the client
                        this.addSelfPlayer(players[id].x, players[id].y);
                    } else {
                        // Add a new player controlled by others
                        this.addOtherPlayer(id, players[id].x, players[id].y);
                    }
                }
            }
        });

        // When a new player connects
        this.socket.on('newPlayer', (playerData) => {
            console.log("newPlayer");
            this.addOtherPlayer(playerData.Id, playerData.x, playerData.y);
        });
        
        // When a player moves
        this.socket.on('playerMoved', (playerData) => {
            // You'll need to find this player in your game and update their position.
            // This could involve iterating over all players and matching on ID, or storing
            // your players in an object where the keys are the socket IDs, similar to the server.
            //console.log("Player moved to: " + playerData.x + " " + playerData.y);
            this.movePlayer(playerData.Id, playerData.x, playerData.y);
        });
        
        // When a player disconnects
        this.socket.on('userDisconnect', (playerId) => {
            // You'll need to find this player and remove them from your game.
            console.log("disconnected");
            this.removePlayer(playerId);
        });

        var fullScreenText = this.add.text(10, 10, 'Go Fullscreen', { fill: '#fff' });
        fullScreenText.setInteractive();
        
        fullScreenText.on('pointerup', function() {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        }, this);

        var key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        key.on('down', function() {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        }, this);
            
        this.graphics = this.add.graphics();

        this.graphics.fillStyle(0x0000ff);

        this.matter.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

        
    }

    update() {

        if (this.socket && this.socket.id) {
            var currentPlayer = this.players[this.socket.id];
            this.graphics.clear();
            const pointer = this.input.activePointer;
        
            const target = new Phaser.Math.Vector2(pointer.x, pointer.y);
            
            let velocity = target.subtract(new Phaser.Math.Vector2(currentPlayer.position.x, currentPlayer.position.y));
            const maxVelocity = velocity.normalize().scale(150);
            if (velocity.length() > maxVelocity.length()) {
                velocity = maxVelocity;
            }

            let forceMagnitude = 0.0019;
            let force = { x: velocity.x * forceMagnitude, y: velocity.y * forceMagnitude };
        
            this.matter.body.applyForce(currentPlayer, currentPlayer.position, force);
            this.socket.emit("playerMovement", {x: currentPlayer.position.x, y: currentPlayer.position.y});
        }

        for (let playerID in this.players) {
            let player = this.players[playerID];
            this.graphics.fillStyle(0x0000ff);
            this.graphics.fillCircle(player.position.x, player.position.y, 30);
        }
        

        
    }
    
    movePlayer(playerId, x, y) {
        if (this.players[playerId]) {
          this.players[playerId].position.x = x;
          this.players[playerId].position.y = y;
        }
    };
      
    addSelfPlayer(x, y) {
        this.players[this.socket.id] = this.matter.add.circle(x, y, 50, {
            friction: 0.005,
            restitution: 0.0,
            density: 0.04
        });
    };

    addOtherPlayer(playerId, x, y) {
        this.players[playerId] = this.matter.add.circle(x, y, 50, {
            friction: 0.005,
            restitution: 0.0,
            density: 0.04
        });
    };

    removePlayer(playerId) {
        delete this.players[playerId];
    };
    
}

window.MainScene = MainScene;