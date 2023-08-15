class PlayerManager {
  constructor(scene) {
      this.scene = scene;
      this.players = {};
  }

  addPlayer(id, x, y) {
      this.players[id] = this.scene.matter.add.circle(x, y, 50, {
          friction: 0.005,
          restitution: 0.0,
          density: 0.04
      });
  }

  movePlayer(id, x, y) {
      if (this.players[id]) {
          this.players[id].position.x = x;
          this.players[id].position.y = y;
      }
  }

  removePlayer(id) {
      if (this.players[id]) {
          //this.players[id].destroy();
          delete this.players[id];
      }
  }

  getPlayerPosition(id) {
      return {x: this.players[id].position.x, y: this.players[id].position.y};
  }

  getAllPlayerPositions() {
      var allPlayerPositions = [];
      for (let playerID in this.players) {
        allPlayerPositions.push({x: this.players[playerID].position.x, y: this.players[playerID].position.y});
      }
      return allPlayerPositions;
  }

  // Accelerates a player towards (x, y) (i.e. the cursor)
  swervePlayer(id, x, y) {
      const target = new Phaser.Math.Vector2(x, y);
      let velocity = target.subtract(new Phaser.Math.Vector2(this.players[id].position.x, this.players[id].position.y));
      const maxVelocity = velocity.normalize().scale(150);
      if (velocity.length() > maxVelocity.length()) {
          velocity = maxVelocity;
      }

      let forceMagnitude = 0.0019;
      let force = { x: velocity.x * forceMagnitude, y: velocity.y * forceMagnitude };
  
      this.scene.matter.body.applyForce(this.players[id], this.players[id].position, force);
  }
}
