import Phaser from 'phaser';
import PlayerManager, { MovementData, RenderData, PlayerData } from './playerManager';
import { Socket, io } from 'socket.io-client';
import SwerverType, { SwerverRenderer } from './classes/swerverType';

class MainScene extends Phaser.Scene {
    playerManager: PlayerManager;
    socket?: Socket;
    graphics?: Phaser.GameObjects.Graphics;

    constructor() {
        super({ key: 'MainScene' });
        this.playerManager = new PlayerManager(this);
    }

    create(): void {
        this.socket = io();
        this.setEventListeners();
        this.initFullScreen();
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x0000ff);
        this.matter.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
    }

    setEventListeners(): void {
        this.socket?.on('connect', () => this.onConnect());
        this.socket?.on('currentPlayers', (players: Record<string, PlayerData>) => this.onCurrentPlayers(players));
        this.socket?.on('newPlayer', (id: string) => this.onNewPlayer(id));
        this.socket?.on('playerMoved', (id: string, movementData: MovementData) => this.onPlayerMoved(id, movementData));
        this.socket?.on('userDisconnect', (playerId: string) => this.onUserDisconnect(playerId));
    }

    initFullScreen(): void {
      const fullScreenText = this.add.text(10, 10, 'Go Fullscreen', { color: '#fff' });
      fullScreenText.setInteractive();
      
      fullScreenText.on('pointerup', () => this.toggleFullScreen());

      //const key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      //key.on('down', () => this.toggleFullScreen());
    }

    toggleFullScreen(): void {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
        } else {
            this.scale.startFullscreen();
        }
    }

    onConnect(): void {
        console.log('Connected to the server');
        console.log('My socket id is: ', this.socket?.id);
        const val = Math.random();
        this.playerManager.addNewPlayer(this.socket?.id || '');
    }

    onCurrentPlayers(players: Record<string, PlayerData>): void {
        for (let playerID in players) {
            this.playerManager.addPlayer(playerID, players[playerID]);
        }
    }

    onNewPlayer(id: string): void {
        this.playerManager.addNewPlayer(id)
    }

    onPlayerMoved(id: string, movementData: MovementData): void {
        this.playerManager.movePlayer(id, movementData);
    }

    onUserDisconnect(playerId: string): void {
        console.log("disconnected: " + playerId);
        this.playerManager.removePlayer(playerId);
    }

    update(time: number, delta: number): void {
        if (this.socket && this.socket.id) {
            this.graphics?.clear();

            const pointer = this.input.activePointer;
            this.playerManager.swervePlayer(this.socket.id, pointer.x, pointer.y, delta);

            const playerMovementData = this.playerManager.getPlayerMovementData(this.socket.id);

            this.socket.emit("playerMovement", playerMovementData);
        }

        const allPlayerRenderData = this.playerManager.getAllPlayerRenderData();

        for (let playerId in allPlayerRenderData) {
            const renderData = allPlayerRenderData[playerId];
            SwerverRenderer.draw(this.graphics, renderData);
        }
    }
}

export default MainScene;