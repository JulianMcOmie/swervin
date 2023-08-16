import Phaser from 'phaser';
import Swerver from './classes/swerver';
import SwerverFactory from './classes/swerverFactory';
import SwerverType from './classes/swerverType';

export interface MovementData {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

export interface RenderData {
  x: number;
  y: number;
  swerverType: SwerverType
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
        var type = SwerverType.Racer;
        if (val < 0.5) {
            type = SwerverType.Bully;
        }

        this.players[id] = SwerverFactory.createSwerver(this.scene, type);
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

  getAllPlayerRenderData(): RenderData[] {
    const allPlayerRenderData: RenderData[] = [];
    for (const playerID in this.players) {
      allPlayerRenderData.push({
          x: this.players[playerID].body.position.x,
          y: this.players[playerID].body.position.y,
          swerverType: this.players[playerID].type
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

    const forceMagnitude = .1 * (delta / 1000);  // Adjusted for delta time
    const force = { x: velocity.x * forceMagnitude, y: velocity.y * forceMagnitude };

    this.scene.matter.body.applyForce(this.players[id].body, this.players[id].body.position, force);
  }
}

export default PlayerManager;