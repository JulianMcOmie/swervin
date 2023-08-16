import Phaser from 'phaser';
import Swerver from './classes/swerver';
import SwerverFactory from './classes/swerverFactory';

interface MovementData {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

interface PlayerData {
  x: number;
  y: number;
  color: string;
  radius: number;
}

class PlayerManager {
  private scene: Phaser.Scene;
  private players: { [id: string]: Swerver };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.players = {};
  }

  addPlayer(id: string): void {
    const val = Math.random();
    if (val < 0.5) {
      this.players[id] = SwerverFactory.createBully(this.scene);
    } else {
      this.players[id] = SwerverFactory.createRacer(this.scene);
    }
  }

  movePlayer(id: string, movementData: MovementData): void {
    if (this.players[id]) {
      this.players[id].body.position.x = movementData.x;
      this.players[id].body.position.y = movementData.y;
      this.scene.matter.body.setVelocity(this.players[id].body, {x: movementData.velocityX, y: movementData.velocityY});
    }
  }

  removePlayer(id: string): void {
    if (this.players[id]) {
      delete this.players[id];
    }
  }

  getPlayerMovementData(id: string): MovementData {
    return {
      x: this.players[id].body.position.x,
      y: this.players[id].body.position.y,
      velocityX: this.players[id].body.velocity.x,
      velocityY: this.players[id].body.velocity.y
    };
  }

  getAllPlayerRenderData(): PlayerData[] {
    const allPlayerRenderData: PlayerData[] = [];
    for (let playerID in this.players) {
      allPlayerRenderData.push({
          x: this.players[playerID].body.position.x,
          y: this.players[playerID].body.position.y,
          color: this.players[playerID].color,
          radius: this.players[playerID].radius
      });
    }
    return allPlayerRenderData;
  }

  // Accelerates a player towards (x, y) (i.e. the cursor)
  swervePlayer(id: string, x: number, y: number, delta: number): void {
    const target = new Phaser.Math.Vector2(x, y);
    let velocity = target.clone().subtract(new Phaser.Math.Vector2(this.players[id].body.position.x, this.players[id].body.position.y));
    const unitVector = velocity.clone().normalize();
    
    const maxVelocity = velocity.clone().normalize().scale(25000 * (delta / 1000));  // Adjusted for delta time
    if (velocity.length() > maxVelocity.length()) {
        velocity = maxVelocity;
    }

    const minVelocity = velocity.clone().normalize().scale(2500 * (delta / 1000));
    if (velocity.length() < minVelocity.length()) {
        velocity = new Phaser.Math.Vector2(0, 0);
    }

    let forceMagnitude = .1 * (delta / 1000);  // Adjusted for delta time
    let force = { x: velocity.x * forceMagnitude, y: velocity.y * forceMagnitude };

    this.scene.matter.body.applyForce(this.players[id].body, this.players[id].body.position, force);
  }
}

export default PlayerManager;