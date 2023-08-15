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

  movePlayer(id, movementData) {
      if (this.players[id]) {
          this.players[id].position.x = movementData.x;
          this.players[id].position.y = movementData.y;
          this.scene.matter.body.setVelocity(this.players[id], {x: movementData.velocityX, y: movementData.velocityY});
      }
  }

  removePlayer(id) {
      if (this.players[id]) {
          delete this.players[id];
      }
  }

  getPlayerMovementData(id) {
      return {
        x: this.players[id].position.x,
        y: this.players[id].position.y,
        velocityX: this.players[id].velocity.x,
        velocityY: this.players[id].velocity.y
    };
  }

  getAllPlayerPositions() {
      var allPlayerPositions = [];
      for (let playerID in this.players) {
        allPlayerPositions.push({x: this.players[playerID].position.x, y: this.players[playerID].position.y});
      }
      return allPlayerPositions;
  }

  // Accelerates a player towards (x, y) (i.e. the cursor)
  swervePlayer(id, x, y, delta) {
    const target = new Phaser.Math.Vector2(x, y);
    console.log("mouseX: " + x + "\nmouseY: " + y);
    let velocity = target.clone().subtract(new Phaser.Math.Vector2(this.players[id].position.x, this.players[id].position.y));
    console.log("target.x: " + target.x + "\ntarget.y: " + target.y + "\nvelocity.x: " + velocity.x + "\nvelocity.y: " + velocity.y);
    const unitVector = velocity.clone().normalize();
    
    const maxVelocity = velocity.clone().normalize().scale(25000 * (delta / 1000));  // Adjusted for delta time
    if (velocity.length() > maxVelocity.length()) {
        velocity = maxVelocity;
    }

    const minVelocity = velocity.clone().normalize().scale(2500 * (delta / 1000));
    console.log("velocity.length(): " + velocity.length() + "\nminVelocity.length(): " + minVelocity.length());
    if (velocity.length() < minVelocity.length()) {
        velocity = new Phaser.Math.Vector2(0, 0);
        console.log("Too Slow");
    }

    let forceMagnitude = .1 * (delta / 1000);  // Adjusted for delta time
    let force = { x: velocity.x * forceMagnitude, y: velocity.y * forceMagnitude };

    this.scene.matter.body.applyForce(this.players[id], this.players[id].position, force);
}

}
