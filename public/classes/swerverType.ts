import Phaser from 'phaser';
import { RenderData } from '../playerManager';


enum SwerverType {
  Racer,
  Bully
}

export class SwerverRenderer {
  static colorFor(swerverType: SwerverType): number {
      switch (swerverType) {
          case SwerverType.Racer:
              return 0xff0000;
          case SwerverType.Bully:
              return 0x0000ff;
      }
  }

  static radiusFor(swerverType: SwerverType): number {
        switch (swerverType) {
            case SwerverType.Racer:
                return 25;
            case SwerverType.Bully:
                return 75;
        }
  }

  static draw(graphics: Phaser.GameObjects.Graphics | undefined, renderData: RenderData) {
      graphics?.fillStyle(this.colorFor(renderData.swerverType));
      graphics?.fillCircle(renderData.x, renderData.y, this.radiusFor(renderData.swerverType));
  }
}

export default SwerverType